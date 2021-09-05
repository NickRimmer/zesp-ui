import {DataControlSettings} from "../models/DataControlSettings";
import {DeviceInfo} from "../models/DeviceInfo";

export interface IDeviceControlProps<TConfig extends DataControlSettings> {
  config: TConfig,
  deviceInfo: DeviceInfo
}