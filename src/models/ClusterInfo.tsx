import {LayoutSettings} from "./LayoutSettings";

export type ClusterInfo = {
  id: string,
  name: string,
  attributes?: { [name: string]: LayoutSettings }
}