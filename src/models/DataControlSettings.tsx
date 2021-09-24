import {ReportKeyInfo} from "./ReportKeyInfo";

export type DataControlSettings = {
  id: string,
  group?: string,
  name?: string,

  // additional properties
  reportKey?: ReportKeyInfo,
  zespRoleSettings?: any,
}

export type DataLayoutItemsGroup = {
  name: string,
  settings: DataControlSettings[]
}
