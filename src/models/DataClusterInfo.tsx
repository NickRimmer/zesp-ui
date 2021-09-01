import {DataLayoutItem} from "./DataLayoutItem";

export type DataClusterInfo = {
  clusterId: string,
  name: string,
  attributes?: { [attributeId: string]: DataLayoutItem }
}