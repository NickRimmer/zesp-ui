import {ZespReportInfo} from "./ZespReportInfo";

export type ZespDeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: { [reportId: string]: ZespReportInfo },
  DevType: string,
  // EP: { [epKey: string]: object },
}