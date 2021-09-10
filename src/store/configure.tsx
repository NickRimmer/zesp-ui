import {configureStore} from '@reduxjs/toolkit'
import zespReducer from "./slices/zespSlice";
import devicesReducer from "./slices/devicesSlice";
import spinnerReducer from "./slices/spinnerSlice";
import settingsSlice from "./slices/settingsSlice";

export const store = configureStore({
  reducer: {
    zesp: zespReducer,
    devices: devicesReducer,
    spinner: spinnerReducer,
    settings: settingsSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;