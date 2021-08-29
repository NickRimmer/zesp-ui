import {ZespDataEvent} from "./common/ZespDataEvent";
import {DeviceInfo, ReportDetails} from "./models/DeviceInfo";
import DataHaClusterIds from "../../data/zigbee/ha-cluster-ids.json";
import {IGlobalState} from "../../global-state";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import predefinedDevices from "../../data/devices.json";
import {DeviceDetails} from "../../models/DeviceDetails";
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

// when list of devices received from ZESP
const onDevicesListReceived = (event: ZespDataEvent, globalState: IGlobalState): void => {
  const jsonString: string = event.dataParts[0];
  const devices: DeviceInfo[] = [];
  Object.assign(devices, JSON.parse(jsonString))

  // additional device data extraction
  for (const device of devices) {
    device.details = getDeviceDetails(device.ModelId);

    for (const key of Object.keys(device.Report))
      device.Report[key].details = getReportDetails(key);
  }

  globalState.setState(x => ({...x, ...{devices: devices}}));
}

// read predefined details
const getDeviceDetails = (modelId: string): DeviceDetails | null =>
  predefinedDevices.find(x => x.modelIds.findIndex(y => y === modelId) >= 0) as DeviceDetails | null;

// parse report key
const getReportDetails = (reportKey: string): ReportDetails => {
  const clusterId = reportKey.substr(2, 4);
  return {
    endpoint: reportKey.substr(0, 2),
    clusterId: clusterId,
    attributeId: reportKey.substr(6),
    name: getReportName(clusterId)
  };
}

// read report name from cluster info
const getReportName = (clusterId: string): string => {
  const reportType = (DataHaClusterIds as ClusterInfo[]).find(x => x.id == clusterId);
  return reportType?.name ?? clusterId;
}

export default ServiceDevices;