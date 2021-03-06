import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespDeviceInfo} from "./models/ZespDeviceInfo";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import predefinedDevices from "../../data/devices.json";
import {DataControlSettings} from "../../models/DataControlSettings";
import {DeviceInfo} from "../../models/DeviceInfo";
import {DataDeviceSettings} from "../../models/DataDeviceSettings";
import {ZespReportInfo} from "./models/ZespReportInfo";
import {layoutTools} from "../../device-controls/layouts";
import {IZespConnector} from "./common/service-connector.interfaces";

interface IGetDevicesResponse {
  devices: DeviceInfo[],
  zespVersion: string | undefined,
}

const ServiceDevices = {
  getDevicesListAsync: (zesp: IZespConnector) => new Promise<IGetDevicesResponse>((resolve, reject) => {
    zesp.zespRequestAsync({
      data: "getDeviceList",
      responseValidator: TypedZespResponseValidator("alldev")
    })
      .then(event => {
        const result = onDevicesListReceived(event);
        resolve({
          devices: result,
          zespVersion: event.dataParts.length > 1 ? event.dataParts[1] : undefined,
        } as IGetDevicesResponse);
      })
      .catch(reason => reject(reason));
  }),

  subscribeListUpdate: (zesp: IZespConnector, onUpdateHandler: (devices: DeviceInfo[]) => void): void => {
    // setTimeout(() => zesp.zespSend({data: "getDeviceList"}), 3000);
    zesp.subscribe(TypedZespResponseValidator("alldev"), event => {
      const result = onDevicesListReceived(event);
      onUpdateHandler(result);
    })
  }
}

// when list of devices received from ZESP
const onDevicesListReceived = (event: ZespDataEvent): DeviceInfo[] => {
  const jsonString: string = event.dataParts[0];
  const zespDevices: ZespDeviceInfo[] = [];
  Object.assign(zespDevices, JSON.parse(jsonString))
  return zespDevices.map(buildDeviceInfo);
}

export const getDeviceModelSettings = (modelId: string): { settings: DataDeviceSettings, controls: DataControlSettings[] } => {
  const settings: DataDeviceSettings = predefinedDevices.find(x => x.modelIds.findIndex(y => y === modelId) >= 0) || {} as DataDeviceSettings;
  const controls = settings?.controls && require(`../../data/controls/${settings.controls}`) as DataControlSettings[] || [];

  return {settings, controls};
}

const buildDeviceInfo = (zespInfo: ZespDeviceInfo): DeviceInfo => {
  const {settings, controls} = getDeviceModelSettings(zespInfo.ModelId);
  controls.forEach(control => {
    if (!control.reportKey) return;
    const reportKey = control.reportKey.endpoint + control.reportKey.clusterId + control.reportKey.attributeId;
    if (!zespInfo.Report[reportKey]) zespInfo.Report[reportKey] = {} as ZespReportInfo;
  });

  // try to autodetect layout by reports
  const layout = settings.layout || layoutTools.autoDetect(zespInfo);

  return {
    zespInfo: zespInfo,
    settings: {...settings, ...{layout: layout}},
    customLayout: controls
  };
}

export default ServiceDevices;
