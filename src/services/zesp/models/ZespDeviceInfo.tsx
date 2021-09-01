import {ZespReportInfo} from "./ZespReportInfo";

export type ZespDeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: { [reportId: string]: ZespReportInfo },
  // EP: { [epKey: string]: object },
}