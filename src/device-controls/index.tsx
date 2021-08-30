import {DeviceInfo} from "../services/zesp/models/DeviceInfo";
import {LayoutSettings, LayoutSettingsLevel, LayoutSettingsOnOff, LayoutSettingsRgb} from "./settings";
import {OnOffControl} from "./OnOffControl";
import {UnknownControl} from "./UnknownControl";
import React from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {OnOffRoot} from "./OnOffRoot";
import {LevelRoot} from "./LevelRoot";
import {RgbRoot} from "./RgbRoot";

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

    default:
      return (<UnknownControl {...controlProps}/>)
  }
}