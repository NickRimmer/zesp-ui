import {DataControlSettings} from "./DataControlSettings";

export type DataReportInfo = {
  clusterId: string,
  name: string,
  attributes?: { [attributeId: string]: DataControlSettings }
}