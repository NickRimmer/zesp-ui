import {ZespDataEvent} from "./common/ZespDataEvent";
import {DeviceInfo} from "./models/DeviceInfo";
import DataHaClusterIds from "../../data/zigbee/ha-cluster-ids.json";
import {IGlobalState} from "../../global-state";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import templates from "../../data/templates.json";
import {TemplateInfo} from "./models/TemplateInfo";

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

  // additional device data extraction
  for (const device of devices) {
    // read template information
    device.templateInfo = templates.find(x => x.modelIds.findIndex(y => y === device.ModelId) >= 0) as TemplateInfo | null;

    // read report information
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