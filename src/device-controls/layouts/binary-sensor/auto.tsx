import {ZespDeviceInfo} from "../../../services/zesp/models/ZespDeviceInfo";
import {reportKeysBattery as binarySensorBatteryKeys, reportKeysValue as binarySensorValueKeys} from "./index";
import {layoutTools} from "../index";

export const AutoDetectionBinarySensor = (zespInfo: ZespDeviceInfo): string | undefined => {
  const valueReportKey = layoutTools.getReport(binarySensorValueKeys, zespInfo);
  const batteryReportKey = layoutTools.getReport(binarySensorBatteryKeys, zespInfo);

  if (!valueReportKey || !batteryReportKey) return undefined; // these two guys required
  if (!layoutTools.roleDeviceClassIs(["battery"], batteryReportKey)) return undefined;
  if (!layoutTools.roleDeviceClassIs(["door", "motion"], valueReportKey)) return undefined;

  console.debug(`Auto detected layout 'binarySensorLayout' for '${zespInfo.IEEE}'`);
  return "binarySensorLayout";
}

export default AutoDetectionBinarySensor;