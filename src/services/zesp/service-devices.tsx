import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespDeviceInfo} from "./models/ZespDeviceInfo";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import predefinedDevices from "../../data/devices.json";
import {DataControlSettings} from "../../models/DataControlSettings";
import {DeviceInfo} from "../../models/DeviceInfo";
import {DataDeviceSettings} from "../../models/DataDeviceSettings";
import {ZespReportInfo} from "./models/ZespReportInfo";
import {LayoutAutoDetection} from "./service-auto-layouts";
import {UpdateDevicesAction} from "./interfaces/UpdateDevicesAction";

const ServiceDevices = {
  getDevicesList: (zesp: IZespConnector, devicesUpdateAction: UpdateDevicesAction) => {
    return zesp.request({
      data: "getDeviceList",
      responseValidator: TypedZespResponseValidator("alldev"),
      onSuccess: (event) => onDevicesListReceived(event, devicesUpdateAction)
    })
  }
}

// when list of devices received from ZESP
const onDevicesListReceived = (event: ZespDataEvent, devicesUpdateAction: UpdateDevicesAction): void => {
  const jsonString: string = event.dataParts[0];
  const zespDevices: ZespDeviceInfo[] = [];
  Object.assign(zespDevices, JSON.parse(jsonString))

  const devices: DeviceInfo[] = zespDevices.map(buildDeviceInfo);
  devicesUpdateAction(devices);
}

const buildDeviceInfo = (zespInfo: ZespDeviceInfo) => {
  const settings: DataDeviceSettings = predefinedDevices.find(x => x.modelIds.findIndex(y => y === zespInfo.ModelId) >= 0) ||
    {} as DataDeviceSettings;

  // add predefined controls and reports
  const controls = settings?.controls && require(`../../data/controls/${settings.controls}`) as DataControlSettings[] | undefined;
  controls && controls.forEach(control => {
    if (!control.reportKey) return;
    const reportKey = control.reportKey.endpoint + control.reportKey.clusterId + control.reportKey.attributeId;
    if (!zespInfo.Report[reportKey]) zespInfo.Report[reportKey] = {} as ZespReportInfo;
  });

  // try to autodetect layout by reports
  const layout = settings.layout
    || LayoutAutoDetection.binarySensor(zespInfo);

  return {
    zespInfo: zespInfo,
    settings: {...settings, ...{layout: layout}},
    customLayout: controls
  } as DeviceInfo;
}

export default ServiceDevices;
