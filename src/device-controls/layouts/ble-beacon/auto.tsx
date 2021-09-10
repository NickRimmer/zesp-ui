import {ZespDeviceInfo} from "../../../services/zesp/models/ZespDeviceInfo";
import {layoutTools} from "../index";

export const AutoDetectionBleBeacon = (zespInfo: ZespDeviceInfo): string | undefined => {
  if (zespInfo.DevType !== "BED" || zespInfo.class !== "beacon") return undefined;

  const rangeReport = layoutTools.getReport(["ble_InRange"], zespInfo);
  const signalReport = layoutTools.getReport(["ble_signal_level"], zespInfo);
  if (!rangeReport || !signalReport) return undefined;

  return "bleBeacon";
}

export default AutoDetectionBleBeacon;