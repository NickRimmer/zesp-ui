import {DefaultLayout} from "./DefaultLayout";
import {BinarySensorLayout} from "./binary-sensor";
import {FunctionComponent} from "react";
import {LayoutProps} from "../../models/LayoutProps";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {ZespDeviceInfo} from "../../services/zesp/models/ZespDeviceInfo";
import AutoDetectionBinarySensor from "./binary-sensor/auto";

// list of available layouts with names
export const layoutsAvailable = {
  default: DefaultLayout,
  binarySensorLayout: BinarySensorLayout,
} as { [name: string]: FunctionComponent<LayoutProps> };

// list of layout auto detection functions, which return layout name
const autoDetectors: { (zespInfo: ZespDeviceInfo): string | undefined }[] = [
  AutoDetectionBinarySensor
];

// region help methods
export const layoutTools = {
  autoDetect: (zespInfo: ZespDeviceInfo): string | undefined => {
    for (const autoDetector of autoDetectors) {
      const layout = autoDetector(zespInfo);
      if (layout) return layout;
    }

    return undefined;
  },

  deviceClassIs: (expectedDeviceClasses: string[], report: ZespReportInfo): boolean => {
    const roleParts = report.role && report.role.split("&");
    if (roleParts.length < 2) return false;

    const roleSettings = JSON.parse(roleParts[1]);
    const reportDeviceClass = roleSettings["device_class"];
    if (!reportDeviceClass) return false;

    return expectedDeviceClasses.indexOf(reportDeviceClass) >= 0;
  },
  getReport: (oneOfKeys: string[], zespInfo: ZespDeviceInfo): ZespReportInfo | undefined => {
    for (const key of oneOfKeys) {
      const report = zespInfo.Report[key];
      if (report) return report;
    }
  }
}
// endregion