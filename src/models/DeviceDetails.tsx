export type GroupName = null | "root" | "light" | "sensor" | "switch";

export type DeviceDetails = {
  modelIds: string[],
  image: string,
  groups?: GroupName[],
  layout?: string | null
}