import {LayoutSettings} from "../device-controls/settings";
import {DeviceInfo} from "../services/zesp/models/DeviceInfo";

export interface IDeviceControlProps<TConfig extends LayoutSettings> {
  config: TConfig,
  deviceInfo: DeviceInfo
}