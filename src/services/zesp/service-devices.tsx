import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespDeviceInfo} from "./models/ZespDeviceInfo";
import {IGlobalState} from "../../global-state";
import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import predefinedDevices from "../../data/devices.json";
import {DataControlSettings} from "../../models/DataControlSettings";
import {DeviceInfo} from "../../models/DeviceInfo";
import {DataDeviceSettings} from "../../models/DataDeviceSettings";
import {ZespReportInfo} from "./models/ZespReportInfo";

const ServiceDevices = {
  getDevicesList: (zesp: IZespConnector) => {
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
  const zespDevices: ZespDeviceInfo[] = [];
  Object.assign(zespDevices, JSON.parse(jsonString))

  const devices: DeviceInfo[] = zespDevices.map(zespInfo => {
    const settings = predefinedDevices.find(x => x.modelIds.findIndex(y => y === zespInfo.ModelId) >= 0) as DataDeviceSettings | undefined;
    const customLayout = settings?.controls && require(`../../data/layouts/${settings.controls}`) as DataControlSettings[] | undefined;

    customLayout && customLayout.forEach(layoutItem => {
      if (!layoutItem.reportKey) return;

      const reportKey = layoutItem.reportKey.endpoint + layoutItem.reportKey.clusterId + layoutItem.reportKey.attributeId;
      zespInfo.Report[reportKey] = {} as ZespReportInfo;
    });

    return {
      zespInfo: zespInfo,
      settings: settings,
      customLayout: customLayout
    } as DeviceInfo;
  });

  globalState.setState(x => ({...x, ...{devices: devices}}));
}

export default ServiceDevices;