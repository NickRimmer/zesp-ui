import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";

export type zespConnectionStatus = "disconnected" | "connected" | "connecting" | "reconnect" | "closed";

export interface ZespState {
  connectionStatus: zespConnectionStatus,
  initialized: boolean,
}

const initialState: ZespState = {
  connectionStatus: "disconnected",
  initialized: false,
}

export const zespSlice = createSlice({
  name: "zesp",
  initialState,
  reducers: {
    setConnectionStatus: (state, action: PayloadAction<zespConnectionStatus>) => {
      state.connectionStatus = action.payload;
    },

    setInitialized: (state, action: PayloadAction<boolean>) => {
      state.initialized = action.payload;
    },
  }
})

const getters = {
  getStatus: (state: RootState) => state.zesp.connectionStatus,
  getInitialized: (state: RootState) => state.zesp.initialized,
}

export const {getStatus, getInitialized,} = getters;
export const {setConnectionStatus, setInitialized,} = zespSlice.actions;
export default zespSlice.reducer;