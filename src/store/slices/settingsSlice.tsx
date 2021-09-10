import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";
import {ZespSettings} from "../../services/zesp/models/ZespSettings";

interface IState {
  zespSettings: ZespSettings | undefined
}

const initialState: IState = {
  zespSettings: undefined
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<ZespSettings>): void => {
      state.zespSettings = action.payload;
    }
  }
});

const getters = {
  getSettings: (state: RootState) => state.settings.zespSettings
}

export const {getSettings} = getters;
export const {setSettings} = settingsSlice.actions;
export default settingsSlice.reducer;
