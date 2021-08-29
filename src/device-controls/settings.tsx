import {ReportInfo} from "../services/zesp/models/DeviceInfo";

export type LayoutSettings = {
  id: string,
  report?: ReportInfo | null
}

export type LayoutSettingsOnOff = LayoutSettings & {
  arguments: {
    commandOn: string,
    commandOff: string,
  }
}

export type LayoutSettingsLevel = LayoutSettings & {
  arguments: {
    command: string,
    min: number,
    max: number,
  }
}

export type LayoutSettingsRgb = LayoutSettings & {
  arguments: {
    command: string,
  }
}