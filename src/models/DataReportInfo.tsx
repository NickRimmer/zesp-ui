import {DataLayoutItem} from "./DataLayoutItem";

export type DataReportInfo = {
  clusterId: string,
  name: string,
  attributes?: { [attributeId: string]: DataLayoutItem }
}