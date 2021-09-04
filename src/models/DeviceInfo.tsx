import {ZespDeviceInfo} from "../services/zesp/models/ZespDeviceInfo";
import {DataDeviceSettings} from "./DataDeviceSettings";
import {DataControlSettings} from "./DataControlSettings";

export type DeviceInfo = {
  zespInfo: ZespDeviceInfo, // data from ZESP service
  settings?: DataDeviceSettings | undefined, // settings from '/data/devices.json' file
  customLayout?: DataControlSettings[] | undefined, // layout configuration from '/data/layouts/<device>.json' file 
} 