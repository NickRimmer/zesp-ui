import {ReportInfo} from "../services/zesp/models/DeviceInfo";

export type DeviceControlSettings = {
  id: string,
  report?: ReportInfo | null
}

export type LayoutConfigOnOff = DeviceControlSettings & {
  arguments: {
    commandOn: string,
    commandOff: string,
  }
}

export type LayoutConfigLevel = DeviceControlSettings & {
  arguments: {
    command: string,
    min: number,
    max: number,
  }
}

export type LayoutConfigRgb = DeviceControlSettings & {
  arguments: {
    command: string,
  }
}