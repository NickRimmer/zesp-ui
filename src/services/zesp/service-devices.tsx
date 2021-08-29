import {ZespDataEvent} from "./common/ZespDataEvent";
import {DeviceInfo} from "./models/DeviceInfo";
import DataHaClusterIds from "../../data/zigbee/ha-cluster-ids.json";
import {IGlobalState} from "../../global-state";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import templates from "../../data/devices.json";
import {TemplateInfo} from "../../models/TemplateInfo";
import {ClusterInfo} from "../../models/ClusterInfo";

const ServiceDevices = {
  requestData: (zesp: IZespConnector) => {
    return zesp.request({
      data: "getDeviceList",
      responseValidator: TypedZespResponseValidator("alldev"),
      onSuccess: (event) => onDevicesListReceived(event, zesp.getGlobalState())
    })
  }
}

// TODO refactoring required to reduce complexity
const onDevicesListReceived = (event: ZespDataEvent, globalState: IGlobalState): void => {
  const jsonString: string = event.dataParts[0];
  const devices: DeviceInfo[] = [];
  Object.assign(devices, JSON.parse(jsonString))

  // additional device data extraction
  for (const device of devices) {
    // read template information
    device.templateInfo = templates.find(x => x.modelIds.findIndex(y => y === device.ModelId) >= 0) as TemplateInfo | null;

    // read report information
    for (const key of Object.keys(device.Report)) {
      const report = device.Report[key];
      const clusterId = key.substr(2, 4);
      report.reportIdInfo = {
        endpoint: key.substr(0, 2),
        clusterId: clusterId,
        attributeId: key.substr(6),
        name: getReportName(clusterId)
      };
    }
  }

  globalState.setState(x => ({...x, ...{devices: devices}}));
}

const getReportName = (clusterId: string): string => {
  const reportType = (DataHaClusterIds as ClusterInfo[]).find(x => x.id == clusterId);
  return reportType?.name ?? clusterId;
}

export default ServiceDevices;