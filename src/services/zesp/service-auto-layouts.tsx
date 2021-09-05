import {ZespReportInfo} from "./models/ZespReportInfo";
import {ZespDeviceInfo} from "./models/ZespDeviceInfo";
import {reportKeysBattery as binarySensorBatteryKeys, reportKeysValue as binarySensorValueKeys} from "../../device-controls/layouts/BinarySensorLayout";

export const LayoutAutoDetection = {
  binarySensor: (zespInfo: ZespDeviceInfo): string | undefined => {
    const valueReportKey = getReport(binarySensorValueKeys, zespInfo);
    const batteryReportKey = getReport(binarySensorBatteryKeys, zespInfo);

    if (!valueReportKey || !batteryReportKey) return undefined; // these two guys required
    if (!deviceClassIs(["battery"], batteryReportKey)) return undefined;
    if (!deviceClassIs(["door", "motion"], valueReportKey)) return undefined;

    console.debug(`Auto detected layout 'binarySensorLayout' for '${zespInfo.IEEE}'`);
    return "binarySensorLayout";
  }
}

// region help methods
const deviceClassIs = (expectedDeviceClasses: string[], report: ZespReportInfo): boolean => {
  const roleParts = report.role && report.role.split("&");
  if (roleParts.length < 2) return false;

  const roleSettings = JSON.parse(roleParts[1]);
  const reportDeviceClass = roleSettings["device_class"];
  if (!reportDeviceClass) return false;

  return expectedDeviceClasses.indexOf(reportDeviceClass) >= 0;
}

const getReport = (oneOfKeys: string[], zespInfo: ZespDeviceInfo): ZespReportInfo | undefined => {
  for (const key of oneOfKeys) {
    const report = zespInfo.Report[key];
    if (report) return report;
  }
}
// endregion