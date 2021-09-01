import {ReportInfo} from "../services/zesp/models/DeviceInfo";
import {ReportKey} from "./ReportKey";

export type LayoutSettings = {
  id: string,
  report?: ReportInfo | null,
  value?: ReportKey,
  group?: string,
  label?: string,
}

export type LayoutSettingsGroup = {
  name: string,
  settings: LayoutSettings[]
}
