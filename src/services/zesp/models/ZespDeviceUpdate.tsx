export type ZespDeviceUpdate = {
  ShortAddr: string,
  EndPoint: string,
  ClusterId: string,
  AttribId: string,
  Dtype: string,
  Data: string,
  parsed: string,
  time: number,
  // LQI: number, // ???
}