import {DeviceInfo} from "../../../models/DeviceInfo";

export type GetDeviceAction = (ieee: string) => DeviceInfo | undefined;
export type GetCurrentDeviceAction = () => DeviceInfo | undefined;