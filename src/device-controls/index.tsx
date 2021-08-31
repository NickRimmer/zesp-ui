import {DeviceInfo} from "../services/zesp/models/DeviceInfo";
import {LayoutSettingsLevel, LayoutSettingsOnOff, LayoutSettingsRgb, LayoutSettingsSensor} from "./settings";
import {OnOffControl} from "./OnOffControl";
import {UnknownControl} from "./UnknownControl";
import React from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {OnOffRoot} from "./OnOffRoot";
import {LevelRoot} from "./LevelRoot";
import {RgbRoot} from "./RgbRoot";
import {IlluminanceSensor} from "./IlluminanceSensor";
import {SpacerDecorative} from "./DecorativeElements";
import {LayoutSettings} from "../models/LayoutSettings";

export const getControlForDevice = (config: LayoutSettings, deviceInfo: DeviceInfo) => {
  const controlProps: IDeviceControlProps<LayoutSettings> = {
    config,
    deviceInfo,
  }

  switch (config.id) {
    case "spacer" :
      return (<SpacerDecorative/>);

    case "on_off_root" :
      return (<OnOffRoot {...controlProps} config={controlProps.config as LayoutSettingsOnOff}/>);
    case "level_root" :
      return (<LevelRoot {...controlProps} config={controlProps.config as LayoutSettingsLevel}/>);
    case "rgb_root" :
      return (<RgbRoot {...controlProps} config={controlProps.config as LayoutSettingsRgb}/>);

    case "on_off_control" :
      return (<OnOffControl {...controlProps} config={controlProps.config as LayoutSettingsOnOff}/>);

    case "illuminance_sensor" :
      return (<IlluminanceSensor {...controlProps} config={controlProps.config as LayoutSettingsSensor}/>);

    default:
      return (<UnknownControl {...controlProps}/>)
  }
}
