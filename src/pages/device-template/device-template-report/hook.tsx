import {Devices} from "../../../services/devices";
import HomeAutoClusters from "../../../data/reports.json";
import {IClusterAttribute, IClusterInfo} from "../../../interfaces/IClusterInfo";
import toast from "react-hot-toast";
import {IDeviceTemplateReportProps} from "./index";

const DeviceTemplateReportHook = ({
  template,
  reportKey,
  showSettingsHandler,
}: IDeviceTemplateReportProps) => {
  const report = template.Report[reportKey]
  const keyInfo = Devices.getReportKeyDetails(reportKey, template.DevType)

  if (!report || !keyInfo) return undefined;

  const clusterInfo = (HomeAutoClusters.find(x => x.clusterId === keyInfo.clusterId) || {name: "Unknown"}) as IClusterInfo;
  const role = (report.role || "").split("&")[0];
  const attributeInfo: IClusterAttribute | undefined = (!clusterInfo?.attributes || Object.keys(clusterInfo.attributes).length === 0)
    ? undefined
    : !role
      ? clusterInfo.attributes[keyInfo.attributeId] || undefined
      : clusterInfo.attributes[`${keyInfo.attributeId}:${role}`] || clusterInfo.attributes[keyInfo.attributeId] || undefined

  const editHandler = () => showSettingsHandler({keyInfo, reportInfo: report}) //toast.success("Not implemented yet", {icon: "🤪"})
  const deleteHandler = () => toast.success("Not implemented yet", {icon: "🤤"})

  return {
    report,
    keyInfo,
    clusterInfo,
    attributeInfo,

    editHandler,
    deleteHandler
  }
}

export default DeviceTemplateReportHook;
