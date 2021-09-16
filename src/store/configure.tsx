import {configureStore} from '@reduxjs/toolkit'
import zespReducer from "./slices/zespSlice";
import devicesReducer from "./slices/devicesSlice";
import spinnerReducer from "./slices/spinnerSlice";
import settingsReducer from "./slices/settingsSlice";
import zespFirmwareReducer from "./slices/zespFirmwareSlice";

export const store = configureStore({
  reducer: {
    zesp: zespReducer,
    devices: devicesReducer,
    spinner: spinnerReducer,
    settings: settingsReducer,
    zespFirmware: zespFirmwareReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;