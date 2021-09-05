import {getControlForDevice} from "../index";
import React, {FunctionComponent} from "react";
import {LayoutProps} from "../../models/LayoutProps";

export const DefaultLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  return (
    <>
      {props.settings.map((control, i) =>
        (<div key={i} className="device-control-group">{getControlForDevice(control, props.device)}</div>))}
    </>
  )
}