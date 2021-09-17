import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";
import {ZespSettings} from "../../services/zesp/models/ZespSettings";
import {UiSettings} from "../../models/UiSettings";

interface IState {
  zespSettings: ZespSettings | undefined,
  uiSettings: UiSettings | undefined,
}

const initialState: IState = {
  zespSettings: undefined,
  uiSettings: undefined,
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setZespSettings: (state, action: PayloadAction<ZespSettings>): void => {
      state.zespSettings = action.payload;
    },

    setUiSettings: (state, action: PayloadAction<UiSettings>): void => {
      state.uiSettings = action.payload;
    }
  }
});

const getters = {
  getZespSettings: (state: RootState) => state.settings.zespSettings,
  getUiSettings: (state: RootState) => state.settings.uiSettings,
}

export const {getZespSettings, getUiSettings} = getters;
export const {setZespSettings, setUiSettings} = settingsSlice.actions;
export default settingsSlice.reducer;
