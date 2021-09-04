import {ReportKeyInfo} from "./ReportKeyInfo";

export type DataControlSettings = {
  id: string,
  reportKey?: ReportKeyInfo,
  group?: string,
  label?: string,
  zespRoleSettings?: any,
}

export type DataLayoutItemsGroup = {
  name: string,
  settings: DataControlSettings[]
}
