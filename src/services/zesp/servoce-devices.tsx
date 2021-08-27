import {ZespDataEvent} from "./common/ZespDataEvent";
import {DeviceInfo} from "./models/DeviceInfo";
import DataHaClusterIds from "./data/ha-cluster-ids.json";
import {IGlobalState} from "../../global-state";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";

const ServiceDevices = {
  requestData: (zesp: IZespConnector) => {
    return zesp.request({
      data: "getDeviceList",
      responseValidator: TypedZespResponseValidator("alldev"),
      onSuccess: (event) => onDevicesListReceived(event, zesp.getGlobalState())
    })
  }
}

const onDevicesListReceived = (event: ZespDataEvent, globalState: IGlobalState): void => {
  const jsonString: string = event.dataParts[0];
  const devices: DeviceInfo[] = [];
  Object.assign(devices, JSON.parse(jsonString))

  // additional data to devices extracting
  for (const device of devices) {
    for (const key of Object.keys(device.Report)) {
      const report = device.Report[key];
      report.reportIdInfo = {
        p1: key.substr(0, 2),
        deviceId: key.substr(2, 4),
        command: key.substr(6),
        name: getReportName(key.substr(2, 4))
      };
    }
  }

  globalState.setState(x => ({...x, ...{devices: devices}}));
}

const getReportName = (deviceId: string): string => {
  const reportType = (DataHaClusterIds as { [deviceId: string]: string })[deviceId];
  return reportType ?? "unknown";
}

export default ServiceDevices;