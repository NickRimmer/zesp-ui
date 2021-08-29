import React from "react";
import {LayoutConfigOnOff} from "../../../models/DeviceControlInfo";

interface IProps {
  config: LayoutConfigOnOff
}

export const OnOffDeviceControl = (props: IProps) => {
  return (
    <>
      <div>off: {props.config.commandOff}</div>
      <div>on: {props.config.commandOn}</div>
    </>
  )
}
