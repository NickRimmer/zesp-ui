import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {DataLayoutItem} from "../models/DataLayoutItem";
import {ZespReportInfo} from "./zesp/models/ZespReportInfo";
import {IGlobalState} from "../global-state";
import {ReportKeyInfo} from "../models/ReportKeyInfo";

export const DeviceControls = {
  extractReport: (props: IDeviceControlProps<DataLayoutItem>): ZespReportInfo | null => {
    if (!props.config.reportKey) {
      console.debug(`No report key in config found for ${props.deviceInfo.zespInfo.IEEE} device and ${props.config.id} control`);
      return null;
    }
    const reportKey = props.config.reportKey.endpoint + props.config.reportKey.clusterId + props.config.reportKey.attributeId;
    return props.deviceInfo.zespInfo.Report[reportKey];
  },

  extractSettings: function <T extends DataLayoutItem>(props: IDeviceControlProps<DataLayoutItem>, layoutId: string): [T | undefined, ZespReportInfo | undefined] {
    const settings = props.deviceInfo.customLayout?.find(x => x.id === layoutId) as T;
    const report = settings && settings.reportKey
      ? props.deviceInfo.zespInfo.Report[settings.reportKey.endpoint + settings.reportKey.clusterId + settings.reportKey.attributeId]
      : undefined;

    return [settings, report];
  },

  trySetReportValue: (globalState: IGlobalState, props: IDeviceControlProps<DataLayoutItem>, value: string, reportKeyInfo?: ReportKeyInfo | null): boolean => {
    const saveReportKeyInfo = reportKeyInfo || props.config.reportKey;
    if (!saveReportKeyInfo) return false;

    const devices = globalState.state.devices;
    const device = devices?.find(x => x.zespInfo.IEEE === props.deviceInfo.zespInfo.IEEE);
    if (!device) return false;

    const reportKey = saveReportKeyInfo.endpoint + saveReportKeyInfo.clusterId + saveReportKeyInfo.attributeId;
    const report = device.zespInfo.Report[reportKey];
    report.val = value;

    globalState.setState(x => ({...x, ...{devices}}));
    return true;
  }
}