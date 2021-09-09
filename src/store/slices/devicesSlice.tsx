import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {DeviceInfo} from "../../models/DeviceInfo";
import {RootState} from "../configure";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {ZespReportUpdates} from "../../services/zesp/service-root";

export interface DevicesState {
  devices: DeviceInfo[]
}

const initialState: DevicesState = {
  devices: []
}

export const devicesSlice = createSlice({
  name: "devices",
  initialState,
  reducers: {
    setDevices: (state, action: PayloadAction<DeviceInfo[]>): void => {
      state.devices = action.payload;
    },
    updateReport: (state, action: PayloadAction<{ ieee: string, reportKey: string, update: Partial<ZespReportInfo> }>): void => {
      const device = state.devices.find(x => x.zespInfo.IEEE === action.payload.ieee);
      if (!device) {
        console.warn(`Device '${action.payload.ieee}' not found to update`);
        return;
      }

      device.zespInfo.Report[action.payload.reportKey] = {...device.zespInfo.Report[action.payload.reportKey], ...action.payload.update};
      console.debug(`Device '${action.payload.ieee}' with report '${action.payload.reportKey}' has been updated`);
    },
    updateRootReports: (state, action: PayloadAction<ZespReportUpdates>) => {
      const device = state.devices.find(x => x.zespInfo.ModelId === "ZESP_Root");
      if (!device) {
        console.warn(`Root device not found to update`);
        return;
      }

      device.zespInfo.Report = {...device.zespInfo.Report, ...action.payload} as { [reportId: string]: ZespReportInfo };
    }
  }
})

const getters = {
  getDeviceByIee: (state: RootState, ieee: string): DeviceInfo | undefined => state.devices.devices.find(x => x.zespInfo.IEEE === ieee),
  getDevicesByModelId: (state: RootState, modelId: string): DeviceInfo[] => state.devices.devices.filter(x => x.zespInfo.ModelId === modelId),
  getAllDevices: (state: RootState): DeviceInfo[] => state.devices.devices || [] as DeviceInfo[],
}

export const {getDevicesByModelId, getDeviceByIee, getAllDevices} = getters;
export const {setDevices, updateReport, updateRootReports} = devicesSlice.actions;
export default devicesSlice.reducer;
