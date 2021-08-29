import {DeviceControlSettings} from "../device-controls/settings";
import {DeviceInfo} from "../services/zesp/models/DeviceInfo";

export interface IDeviceControlProps<TConfig extends DeviceControlSettings> {
  config: TConfig,
  deviceInfo: DeviceInfo
}