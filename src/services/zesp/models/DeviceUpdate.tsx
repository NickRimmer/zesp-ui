export type DeviceUpdate = {
  ShortAddr: string,
  EndPoint: string,
  ClusterId: string,
  AttribId: string,
  Dtype: number,
  Data: string,
  parsed: string,
  time: number,
  // LQI: number, // ???
}