import {ZespReportInfo} from "./ZespReportInfo";

export type ZespDeviceInfo = {
  Device: string,
  Name: string | null,
  IEEE: string,
  ModelId: string,
  Report: { [reportId: string]: ZespReportInfo },
  DevType: string,
  Img: string,
  class: string,
  // EP: { [epKey: string]: object },
}