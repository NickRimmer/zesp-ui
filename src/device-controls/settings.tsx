import {DataLayoutItem} from "../models/DataLayoutItem";

export type LayoutSettingsSensor = DataLayoutItem & {
  arguments: {
    clusterId: string,
    attributeId: string,
  }
}

export type LayoutSettingsOnOff = DataLayoutItem & {
  arguments: {
    commandOn: string,
    commandOff: string,
  }
}

export type LayoutSettingsLevel = DataLayoutItem & {
  arguments: {
    command: string,
    min: number,
    max: number,
  }
}

export type LayoutSettingsRgb = DataLayoutItem & {
  arguments: {
    command: string,
  }
}