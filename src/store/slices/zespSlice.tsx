import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";

export interface ZespState {
  connectionStatus: "disconnected" | "connected",
  initialized: boolean,
}

const initialState: ZespState = {
  connectionStatus: "disconnected",
  initialized: false
}

export const zespSlice = createSlice({
  name: "zesp",
  initialState,
  reducers: {
    setConnected: (state) => {
      state.connectionStatus = "connected";
    },

    setDisconnected: (state) => {
      state.connectionStatus = "disconnected"
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    }
  }
})

const getters = {
  getStatus: (state: RootState) => state.zesp.connectionStatus,
  getInitialized: (state: RootState) => state.zesp.initialized
}

export const {getStatus, getInitialized} = getters;
export const {setConnected, setDisconnected, setInitialized} = zespSlice.actions;
export default zespSlice.reducer;