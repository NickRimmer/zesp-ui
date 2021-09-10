import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {DataControlSettings} from "../models/DataControlSettings";
import {ZespReportInfo} from "./zesp/models/ZespReportInfo";

export const DeviceControls = {
  getControlReport: (props: IDeviceControlProps<DataControlSettings>): ZespReportInfo | null => {
    if (!props.config.reportKey) {
      console.debug(`No report key in config found for ${props.deviceInfo.zespInfo.IEEE} device and ${props.config.id} control`);
      return null;
    }
    const reportKey = props.config.reportKey.endpoint + props.config.reportKey.clusterId + props.config.reportKey.attributeId;
    return props.deviceInfo.zespInfo.Report[reportKey];
  },

  getControlSettings: function <T extends DataControlSettings>(props: IDeviceControlProps<DataControlSettings>, layoutId: string): [T | undefined, ZespReportInfo | undefined] {
    const settings = props.deviceInfo.customLayout?.find(x => x.id === layoutId) as T;
    const report = settings && settings.reportKey
      ? props.deviceInfo.zespInfo.Report[settings.reportKey.endpoint + settings.reportKey.clusterId + settings.reportKey.attributeId]
      : undefined;

    return [settings, report];
  },
}
