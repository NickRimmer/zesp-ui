import {Dispatch, SetStateAction} from "react";
import {ZespSettings} from "./services/zesp/models/ZespSettings";
import {DeviceInfo} from "./models/DeviceInfo";

interface GlobalStateInterface {
  spinnerLoadingShow: boolean,
  zespConnected: boolean,
  zespSettings?: ZespSettings,
  devices: DeviceInfo[],
}

export interface IGlobalState {
  state: Partial<GlobalStateInterface>,
  setState: Dispatch<SetStateAction<Partial<GlobalStateInterface>>>
}

// eslint-disable-next-line
const GetDefaultGlobalStateValues = (useGlobalState: () => IGlobalState): GlobalStateInterface => {
  return ({
    spinnerLoadingShow: false,
    zespConnected: false,
    zespSettings: undefined,
    devices: [] as DeviceInfo[]
  });
};

export {GetDefaultGlobalStateValues};
export type {GlobalStateInterface};