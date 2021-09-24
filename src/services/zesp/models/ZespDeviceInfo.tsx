import {ZespReportInfo} from "./ZespReportInfo";

export type ZespDeviceInfo = {
  Device: string,
  Name: string | undefined,
  Location: string | undefined,
  IEEE: string,
  ModelId: string,
  Report: { [reportId: string]: ZespReportInfo },
  DevType: string,
  Img: string,
  class: string,
  EP: { [epKey: string]: ZespEndpoint },
}

type ZespEndpoint = {
  PrfId: string,
  ClI: string[],
  ClO: string[],
}