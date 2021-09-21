import {Devices} from "../../../services/devices";
import HomeAutoClusters from "../../../data/reports.json";
import {IClusterAttribute, IClusterInfo} from "../../../interfaces/IClusterInfo";
import {IDeviceTemplate} from "../hook";
import toast from "react-hot-toast";

interface IProps {
  template: IDeviceTemplate,
  reportKey: string,
}

const DeviceTemplateReportHook = ({
  template,
  reportKey
}: IProps) => {
  const report = template.reports[reportKey]
  const keyInfo = Devices.getReportKeyDetails(reportKey, template.devType)

  if (!report || !keyInfo) return undefined;

  const clusterInfo = (HomeAutoClusters.find(x => x.clusterId === keyInfo.clusterId) || {name: "Unknown"}) as IClusterInfo;
  const role = (report.role || "").split("&")[0];
  const attributeInfo: IClusterAttribute | undefined = (!clusterInfo?.attributes || Object.keys(clusterInfo.attributes).length === 0)
    ? undefined
    : !role
      ? clusterInfo.attributes[keyInfo.attributeId] || undefined
      : clusterInfo.attributes[`${keyInfo.attributeId}:${role}`] || clusterInfo.attributes[keyInfo.attributeId] || undefined

  const runHandler = () => toast.success("Not implemented yet", {icon: "🤭"})
  const editHandler = () => toast.success("Not implemented yet", {icon: "🤪"})
  const deleteHandler = () => toast.success("Not implemented yet", {icon: "🤤"})

  return {
    report,
    keyInfo,
    clusterInfo,
    attributeInfo,

    runHandler,
    editHandler,
    deleteHandler
  }
}

export default DeviceTemplateReportHook;