import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";

export interface DevicesState {
  spinnerShow: boolean
}

const initialState: DevicesState = {
  spinnerShow: false,
}

export const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    setSpinnerShow: (state, action: PayloadAction<boolean>): void => {
      state.spinnerShow = action.payload;
    }
  }
});

const getters = {
  getSpinnerShow: (state: RootState) => state.spinner.spinnerShow
}

export const {getSpinnerShow} = getters;
export const {setSpinnerShow} = spinnerSlice.actions;
export default spinnerSlice.reducer;
