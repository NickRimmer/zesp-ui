import {TemplateInfo} from "../../../models/TemplateInfo";

export type DeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: ReportInfoCollection,
  // EP: object,
  templateInfo: TemplateInfo | null,
}

type ReportInfoCollection = { [reportId: string]: ReportInfo };

export type ReportInfo = {
  label: string,
  val: string,
  mat: string,
  role: string,
  parsed: string,
  time: string,
  reportIdInfo: DeviceReportIdInfo,
}

export type DeviceReportIdInfo = {
  name: string,
  endpoint: string,
  clusterId: string,
  attributeId: string,
}
