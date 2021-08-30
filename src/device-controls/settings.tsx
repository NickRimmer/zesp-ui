import {ReportInfo} from "../services/zesp/models/DeviceInfo";
import {ReportKey} from "../models/ReportKey";

export type LayoutSettings = {
  id: string,
  report?: ReportInfo | null,
  value?: ReportKey,
}

export type LayoutSettingsSensor = LayoutSettings & {
  arguments: {
    clusterId: string,
    attributeId: string,
  }
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