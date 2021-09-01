import React from "react";
import {LayoutSettingsLevel, LayoutSettingsOnOff, LayoutSettingsRgb, LayoutSettingsSensor} from "./settings";
import {DeviceInfo} from "../services/zesp/models/DeviceInfo";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {OnOffRoot} from "./root/OnOffRoot";
import {LevelRoot} from "./root/LevelRoot";
import {RgbRoot} from "./root/RgbRoot";
import {OnOffControl} from "./controls/OnOffControl";
import {UnknownControl} from "./controls/UnknownControl";
import {IlluminanceSensor} from "./sensors/IlluminanceSensor";

import {LayoutSettings} from "../models/LayoutSettings";
import {LevelControl} from "./controls/LevelControl";

export const getControlForDevice = (config: LayoutSettings, deviceInfo: DeviceInfo) => {
  const controlProps: IDeviceControlProps<LayoutSettings> = {
    config,
    deviceInfo,
  }

  switch (config.id) {
    case "on_off_root" :
      return (<OnOffRoot {...controlProps} config={controlProps.config as LayoutSettingsOnOff}/>);
    case "level_root" :
      return (<LevelRoot {...controlProps} config={controlProps.config as LayoutSettingsLevel}/>);
    case "rgb_root" :
      return (<RgbRoot {...controlProps} config={controlProps.config as LayoutSettingsRgb}/>);

    case "on_off_control" :
      return (<OnOffControl {...controlProps} config={controlProps.config as LayoutSettingsOnOff}/>);
    case "level_control" :
      return (<LevelControl {...controlProps} config={controlProps.config as LayoutSettingsLevel}/>);

    case "illuminance_sensor" :
      return (<IlluminanceSensor {...controlProps} config={controlProps.config as LayoutSettingsSensor}/>);

    default:
      return (<UnknownControl {...controlProps}/>)
  }
}
