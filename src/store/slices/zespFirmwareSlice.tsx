import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";
import {DictionaryStrings} from "../../models/DictionaryStrings";

interface IState {
  zespFirmwareUpdateInfo: DictionaryStrings | undefined,
  zespFirmwareInstalledVersion: string,
  zespSkipVersion: string | undefined,
}

const initialState: IState = {
  zespFirmwareUpdateInfo: undefined,
  zespFirmwareInstalledVersion: "-",
  zespSkipVersion: undefined,
}

export const zespFirmwareSlice = createSlice({
  name: "zespFirmwareUpdate",
  initialState: initialState,
  reducers: {
    setZespFirmwareUpdate: (state, action: PayloadAction<DictionaryStrings>): void => {
      state.zespFirmwareUpdateInfo = action.payload;
    },

    setZespFirmwareInstalledVersion: (state, action: PayloadAction<string>): void => {
      state.zespFirmwareInstalledVersion = action.payload;
    },
  }
});

const getters = {
  getZespFirmwareUpdateInfo: (state: RootState) => state.zespFirmware.zespFirmwareUpdateInfo,
  getZespFirmwareInstalledVersion: (state: RootState) => state.zespFirmware.zespFirmwareInstalledVersion,
}

export const {getZespFirmwareUpdateInfo, getZespFirmwareInstalledVersion} = getters;
export const {setZespFirmwareUpdate, setZespFirmwareInstalledVersion} = zespFirmwareSlice.actions;
export default zespFirmwareSlice.reducer;