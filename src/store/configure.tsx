import {configureStore} from '@reduxjs/toolkit'
import zespReducer from "./slices/zespSlice";
import devicesReducer from "./slices/devicesSlice";
import spinnerReducer from "./slices/spinnerSlice";
// import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    zesp: zespReducer,
    devices: devicesReducer,
    spinner: spinnerReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;