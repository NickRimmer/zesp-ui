import {useParams} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {ZespContext} from "../../shared/agents/ZespAgent";
import {TypedZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";

type hookStatuses = "loading" | "error" | "loaded";

export interface IDeviceTemplate {
  title: string,
  devType: string,
  reports: { [key: string]: ZespReportInfo },
}

export default () => {
  const {ieee} = useParams<{ ieee: string }>();
  const {zespRequestAsync} = useContext(ZespContext);
  const fileName = `/Devices/${ieee}`;
  const [template, setTemplate] = useState<IDeviceTemplate>();
  const [status, setStatus] = useState<hookStatuses>("loading");

  useEffect(() => {
    zespRequestAsync({data: `LoadJson|${fileName}`, responseValidator: TypedZespResponseValidator(fileName)})
      .then(event => {
        if (event.dataParts.length < 1) throw Error("Unexpected device settings from ZESP")

        // we need 'any' type here, but later will expose it by types
        // eslint-disable-next-line
        const response = JSON.parse(event.dataParts[0]) as { [key: string]: any }
        return {
          title: response["Name"] || response["ModelId"],
          reports: response["Report"],
          devType: response["DevType"],
        } as IDeviceTemplate
      })
      .then(result => {
        setTemplate(result);
        setStatus("loaded");
      })
      .catch(() => {
        setStatus("error");
      })
  }, []);

  return {
    template,
    status,
    ieee,
  }
}