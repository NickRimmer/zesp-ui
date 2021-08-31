import {DeviceInfo} from "../services/zesp/models/DeviceInfo";
import {LayoutSettings} from "../models/LayoutSettings";

export interface IDeviceControlProps<TConfig extends LayoutSettings> {
  config: TConfig,
  deviceInfo: DeviceInfo
}