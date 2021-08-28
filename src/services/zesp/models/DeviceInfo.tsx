import {TemplateInfo} from "./TemplateInfo";

export type DeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: ReportDictionary,
  // EP: object,
  templateInfo: TemplateInfo | null,
}

type ReportDictionary = { [reportId: string]: DeviceReportInfo };

type DeviceReportInfo = {
  label: string,
  val: string,
  mat: string,
  role: string,
  parsed: string,
  time: string,
  reportIdInfo: DeviceReportIdInfo,
}

export type DeviceReportIdInfo = {
  p1: string,
  deviceId: string,
  name: string,
  command: string,
}
