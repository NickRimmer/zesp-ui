import {ZespDeviceInfo} from "../services/zesp/models/ZespDeviceInfo";
import {DataDeviceSettings} from "./DataDeviceSettings";
import {DataLayoutItem} from "./DataLayoutItem";

export type DeviceInfo = {
  zespInfo: ZespDeviceInfo, // data from ZESP service
  settings?: DataDeviceSettings | undefined, // settings from '/data/devices.json' file
  customLayout?: DataLayoutItem[] | undefined, // layout configuration from '/data/layouts/<device>.json' file 
} 