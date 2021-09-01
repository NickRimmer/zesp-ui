import {ReportKeyInfo} from "./ReportKeyInfo";

export type DataLayoutItem = {
  id: string,
  reportKey?: ReportKeyInfo,
  group?: string,
  label?: string,
  zespRoleSettings?: any,
}

export type DataLayoutItemsGroup = {
  name: string,
  settings: DataLayoutItem[]
}
