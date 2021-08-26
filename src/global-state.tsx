import {Dispatch, SetStateAction} from "react";
import {ZespSettings} from "./services/zesp/models/ZespSettings";

interface GlobalStateInterface {
  spinnerLoadingShow: boolean,
  zespConnected: boolean,
  appInitialized: boolean,
  zespSettings?: ZespSettings,
  selectedServerIndex: number | null,
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
    appInitialized: false,
    zespSettings: undefined,
    selectedServerIndex: null,
  });
};

export {GetDefaultGlobalStateValues};
export type {GlobalStateInterface};