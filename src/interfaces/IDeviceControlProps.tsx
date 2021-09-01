import {DataLayoutItem} from "../models/DataLayoutItem";
import {DeviceInfo} from "../models/DeviceInfo";

export interface IDeviceControlProps<TConfig extends DataLayoutItem> {
  config: TConfig,
  deviceInfo: DeviceInfo
}