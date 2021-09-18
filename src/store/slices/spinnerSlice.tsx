import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {RootState} from "../configure";

interface IState {
  spinnerShow: boolean,
  spinnerMessage: string,
}

const initialState: IState = {
  spinnerShow: false,
  spinnerMessage: "Loading...",
}

export const spinnerSlice = createSlice({
  name: "spinner",
  initialState,
  reducers: {
    setSpinnerShow: (state, action: PayloadAction<boolean>): void => {
      state.spinnerShow = action.payload;
      if (state.spinnerShow) state.spinnerMessage = initialState.spinnerMessage;
    },

    setSpinner: (state, action: PayloadAction<{ show: boolean, message: string | undefined }>): void => {
      state.spinnerShow = action.payload.show;
      state.spinnerMessage = action.payload.message || initialState.spinnerMessage;
    }
  }
});

const getters = {
  getSpinner: (state: RootState) => state.spinner,
}

export const {getSpinner} = getters;
export const {setSpinnerShow, setSpinner} = spinnerSlice.actions;
export default spinnerSlice.reducer;
