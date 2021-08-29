import {DeviceControlSettings} from "../device-controls/settings";

export type ClusterInfo = {
  id: string,
  name: string,
  attributes?: { [name: string]: DeviceControlSettings }
}