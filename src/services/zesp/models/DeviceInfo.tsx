import {DeviceDetails} from "../../../models/DeviceDetails";

export type DeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: { [reportId: string]: ReportInfo },
  // EP: object,

  details: DeviceDetails | null,
}

export type ReportInfo = {
  label: string,
  val: string,
  mat: string,
  role: string,
  parsed: string,
  time: string,

  details: ReportDetails,
}

export type ReportDetails = {
  name: string,
  endpoint: string,
  clusterId: string,
  attributeId: string,
}
