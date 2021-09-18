import {getControlForDevice} from "../index";
import React, {FunctionComponent, useState} from "react";
import {LayoutProps} from "../../models/LayoutProps";

export const DefaultLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const controls: React.ReactElement[] = [];
  const unknown: React.ReactElement[] = [];

  props.settings.forEach(settings => {
    const element = getControlForDevice(settings, props.device);
    if (!element) return;

    if (element?.type.name.toLowerCase() === "UnknownControl".toLocaleLowerCase()) unknown.push(element);
    else controls.push(element);
    console.log(element?.type.name); //TODO remove this log
  });

  // show by default if now identified controls found
  const [showUnknown, setShowUnknown] = useState(controls.length === 0);

  const onToggleUnknownHandler = () => {
    setShowUnknown(!showUnknown);
  }

  return (
    <div className="default-layout">
      {controls.length > 0 && (
        <div className="elements">
          {controls.map((element, i) => {
            return (<div key={i} className="device-control-group">{element}</div>);
          })}
        </div>
      )}

      {unknown.length > 0 && (
        <>
          <button onClick={onToggleUnknownHandler} className="show-unknown-btn btn btn-outline-info">Unknown reports ({unknown.length})</button>
          <div className={`elements unknown ${showUnknown ? "show" : "hide"}`}>
            {unknown.map((element, i) => {
              return (<div key={i} className="device-control-group">{element}</div>);
            })}
          </div>
        </>
      )}
    </div>
  )
}