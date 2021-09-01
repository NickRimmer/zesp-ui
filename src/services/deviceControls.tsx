import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {DataLayoutItem} from "../models/DataLayoutItem";
import {ZespReportInfo} from "./zesp/models/ZespReportInfo";
import {IGlobalState} from "../global-state";

export const DeviceControls = {
  extractReport: (data: IDeviceControlProps<DataLayoutItem>): ZespReportInfo | null => {
    if (!data.config.reportKey) {
      console.debug(`No report key in config found for ${data.deviceInfo.zespInfo.IEEE} device and ${data.config.id} control`);
      return null;
    }
    const reportKey = data.config.reportKey.endpoint + data.config.reportKey.clusterId + data.config.reportKey.attributeId;
    return data.deviceInfo.zespInfo.Report[reportKey];
  },

  trySetReportValue: (globalState: IGlobalState, props: IDeviceControlProps<DataLayoutItem>, value: string): boolean => {
    if (!props.config.reportKey) return false;
    const devices = globalState.state.devices;
    const device = devices?.find(x => x.zespInfo.IEEE === props.deviceInfo.zespInfo.IEEE);
    if (!device) return false;

    const reportKey = props.config.reportKey.endpoint + props.config.reportKey.clusterId + props.config.reportKey.attributeId;
    const report = device.zespInfo.Report[reportKey];
    report.val = value;

    globalState.setState(x => ({...x, ...{devices}}));
    return true;
  }
}