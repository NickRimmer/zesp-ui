import {DeviceInfo, ReportInfo} from "../services/zesp/models/DeviceInfo";
import {DeviceControlSettings, LayoutConfigOnOff} from "./settings";
import {OnOffDeviceControl} from "./OnOffDeviceControl";
import {UnknownDeviceControl} from "./UnknownDeviceControl";
import React from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";

export const getControlForDevice = (config: DeviceControlSettings, deviceInfo: DeviceInfo) => {
  const controlProps: IDeviceControlProps<DeviceControlSettings> = {
    config,
    deviceInfo,
  }

  switch (config.id) {
    case "on_off_control" :
      return (<OnOffDeviceControl {...controlProps} config={controlProps.config as LayoutConfigOnOff}/>);
    default:
      return (<UnknownDeviceControl {...controlProps}/>)
  }
}