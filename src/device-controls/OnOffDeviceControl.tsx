import React from "react";
import {LayoutConfigOnOff} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";

export const OnOffDeviceControl = (props: IDeviceControlProps<LayoutConfigOnOff>) => {
  return (
    <>
      <div>off: {props.config?.arguments?.commandOff}</div>
      <div>on: {props.config?.arguments?.commandOn}</div>
    </>
  )
}
