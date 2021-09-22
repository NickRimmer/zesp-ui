import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ZespContext} from "../../shared/agents/ZespAgent";
import {TypedZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {useDispatch, useSelector} from "react-redux";
import {getAllDevices, updateReport} from "../../store/slices/devicesSlice";
import {ReportKeyInfo} from "../../models/ReportKeyInfo";
import {ZespDeviceInfo} from "../../services/zesp/models/ZespDeviceInfo";
import toast from "react-hot-toast";

type hookStatuses = "loading" | "error" | "loaded";

export default () => {
  const dispatch = useDispatch()
  const {ieee} = useParams<{ ieee: string }>();
  const {zespRequestAsync} = useContext(ZespContext);
  const fileName = `/Devices/${ieee}`;
  const [template, setTemplate] = useState<ZespDeviceInfo>();
  const [status, setStatus] = useState<hookStatuses>("loading");
  const [play, setPlay] = useState<ReportKeyInfo>();
  const [showSettings, setShowSettings] = useState<{ keyInfo: ReportKeyInfo, reportInfo: ZespReportInfo }>();

  const devices = useSelector(getAllDevices)
    .map(x => ({
      name: x.zespInfo.Name || x.zespInfo.ModelId,
      ieee: x.zespInfo.IEEE,
    }))
    .sort(devicesSorting);

  useEffect(() => {
    zespRequestAsync({data: `LoadJson|${fileName}`, responseValidator: TypedZespResponseValidator(fileName)})
      .then(event => {
        if (event.dataParts.length < 1) throw Error("Unexpected device settings from ZESP")

        // we need 'any' type here, but later will expose it by types
        // eslint-disable-next-line
        const response = JSON.parse(event.dataParts[0]) as ZespDeviceInfo
        setTemplate(response);
        setStatus("loaded");
      })
      .catch(() => {
        setStatus("error");
      })
  }, [ieee]);

  const onSaveReportSettings = (keyInfo: ReportKeyInfo, reportInfo: ZespReportInfo): void => {
    const reportKey = `${keyInfo.endpoint}${keyInfo.clusterId}${keyInfo.attributeId}`
    const updatedReports = {...template!.Report, ...{[reportKey]: reportInfo}}
    const updatedTemplate = {...template, ...{Report: updatedReports}}
    const json = JSON.stringify(updatedTemplate);

    zespRequestAsync({
      data: `SaveJson|${fileName}|${json}`,
      responseValidator: TypedZespResponseValidator("ZD_RSP")
    })
      .then(event => {
        if (event.dataParts.length < 2 || event.dataParts[1].toLowerCase() !== "ok") throw Error("Cannot save device settings");
        dispatch(updateReport({ieee, reportKey, update: reportInfo}))
        setTemplate(updatedTemplate as ZespDeviceInfo)
        toast.success("Report settings updated");
      })
  }

  const playHandler = (keyInfo: ReportKeyInfo): void => setPlay(keyInfo);

  return {
    template,
    devices,
    status,
    ieee,
    showSettings,
    play,

    setShowSettings,
    onSaveReportSettings,
    playHandler,
  }
}

const devicesSorting = (a: { name: string }, b: { name: string }): number => {
  if (a.name === "ZESP_Root") return -1;
  if (b.name === "ZESP_Root") return 1;

  if (a.name < b.name) return -1;
  if (a.name > b.name) return 1;

  return 0;
}
