import {LayoutSettings} from "../models/LayoutSettings";

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