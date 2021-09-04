import {DataControlSettings} from "../models/DataControlSettings";

export type LayoutSettingsSensor = DataControlSettings & {
  arguments: {
    clusterId: string,
    attributeId: string,
  }
}

export type LayoutSettingsOnOff = DataControlSettings & {
  arguments: {
    commandOn: string,
    commandOff: string,
  }
}

export type LayoutSettingsLevel = DataControlSettings & {
  arguments: {
    command: string,
    min: number,
    max: number,
  }
}

export type LayoutSettingsCommand = DataControlSettings & {
  arguments: {
    command: string,
  }
}