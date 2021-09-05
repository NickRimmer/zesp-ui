import {getControlForDevice} from "../index";
import React, {FunctionComponent} from "react";
import {LayoutProps} from "../../models/LayoutProps";

export const DefaultLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  return (
    <>
      {props.settings.map((control, i) => {
        const element = getControlForDevice(control, props.device);
        return element && (<div key={i} className="device-control-group">{element}</div>);
      })}
    </>
  )
}