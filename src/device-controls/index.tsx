import React from "react";
import {LayoutSettingsCommand, LayoutSettingsLevel, LayoutSettingsOnOff, LayoutSettingsSensor} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {OnOffRoot} from "./root/OnOffRoot";
import {LevelRoot} from "./root/LevelRoot";
import {RgbRoot} from "./root/RgbRoot";
import {OnOffControl} from "./controls/OnOffControl";
import {UnknownControl} from "./controls/UnknownControl";
import {IlluminanceSensor} from "./sensors/IlluminanceSensor";

import {DataLayoutItem} from "../models/DataLayoutItem";
import {LevelControl} from "./controls/LevelControl";
import {DeviceInfo} from "../models/DeviceInfo";
import {PlayerSrcRoot} from "./root/PlayerSrcRoot";

export const getControlForDevice = (config: DataLayoutItem, deviceInfo: DeviceInfo) => {
  const controlProps: IDeviceControlProps<DataLayoutItem> = {
    config,
    deviceInfo,
  }

  switch (config.id) {
    case "on_off_root" :
      return (<OnOffRoot {...controlProps} config={controlProps.config as LayoutSettingsOnOff}/>);
    case "level_root" :
      return (<LevelRoot {...controlProps} config={controlProps.config as LayoutSettingsLevel}/>);
    case "rgb_root" :
      return (<RgbRoot {...controlProps} config={controlProps.config as LayoutSettingsCommand}/>);
    case "player_src_root" :
      return (<PlayerSrcRoot {...controlProps} config={controlProps.config as DataLayoutItem}/>);

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
