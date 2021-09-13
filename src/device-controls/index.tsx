import React, {FunctionComponent} from "react";
import {LayoutSettingsCommand, LayoutSettingsLevel, LayoutSettingsOnOff, LayoutSettingsOnOffToggle, LayoutSettingsSensor} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {OnOffRoot} from "./root/OnOffRoot";
import {LevelRoot} from "./root/LevelRoot";
import {RgbRoot} from "./root/RgbRoot";
import {UnknownControl} from "./unknown";
import {IlluminanceSensor} from "./sensors/IlluminanceSensor";

import {DataControlSettings} from "../models/DataControlSettings";
import {LevelControl} from "./controls/LevelControl";
import {DeviceInfo} from "../models/DeviceInfo";
import {PlayerSrcRoot} from "./root/PlayerSrcRoot";
import {OnOffBinarySensor} from "./sensors/OnOffBinarySensor";
import {ValueSensor} from "./sensors/ValueSensor";
import {Col} from "react-bootstrap";
import {OnOffToggle} from "./controls/OnOffToggle";

export const getControlForDevice = (config: DataControlSettings, deviceInfo: DeviceInfo): JSX.Element | undefined => {
  const controlProps: IDeviceControlProps<DataControlSettings> = {
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
      return (<PlayerSrcRoot {...controlProps} config={controlProps.config as DataControlSettings}/>);
    case "player_control_root":
      return undefined;

    case "level_control" :
      return (<LevelControl {...controlProps} config={controlProps.config as LayoutSettingsLevel}/>);

    case "illuminance_sensor" :
      return (<IlluminanceSensor {...controlProps} config={controlProps.config as LayoutSettingsSensor}/>);
    case "binary_sensor" :
      return (<OnOffBinarySensor {...controlProps} config={controlProps.config as DataControlSettings}/>);
    case "sensor" :
      return (<ValueSensor {...controlProps} config={controlProps.config as DataControlSettings}/>);

    case "on_off_toggle":
      return (<OnOffToggle {...controlProps} config={controlProps.config as LayoutSettingsOnOffToggle}/>);

    default:
      return (<UnknownControl {...controlProps}/>)
  }
}

export const DeviceControlCol1: FunctionComponent<React.HTMLProps<HTMLButtonElement>> = (props) => {
  return (<Col md="4">{props.children}</Col>)
}

export const DeviceControlCol2: FunctionComponent<React.HTMLProps<HTMLButtonElement>> = (props) => {
  return (<Col>{props.children}</Col>)
}