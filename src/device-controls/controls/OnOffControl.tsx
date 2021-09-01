import React from "react";
import {LayoutSettingsOnOff} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";

export const OnOffControl = (props: IDeviceControlProps<LayoutSettingsOnOff>) => {
  return (
    <>
      <div>off: {props.config?.arguments?.commandOff}</div>
      <div>on: {props.config?.arguments?.commandOn}</div>
    </>
  )
}