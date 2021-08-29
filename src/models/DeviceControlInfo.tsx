export type DeviceControlInfo = {
  id: string,
  config?: null | LayoutConfigOnOff | LayoutConfigLevel | LayoutConfigRgb
}

export type LayoutConfigOnOff = {
  commandOn: string,
  commandOff: string,
}

export type LayoutConfigLevel = {
  command: string,
  min: number,
  max: number,
}

export type LayoutConfigRgb = {
  command: string,
}