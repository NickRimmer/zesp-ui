import React from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {DeviceControlSettings} from "./settings";

export const UnknownDeviceControl = (props: IDeviceControlProps<DeviceControlSettings>) => {
  const configData = JSON.stringify(Object.assign({...props.config}, {report: null})); // remove report to eject it to another var
  const reportData = JSON.stringify(props.config.report);

  return (
    <>
      <div>Unknown control: {props.config.id}</div>
      <div className="alert alert-info">
        <div>{configData}</div>
        {reportData && (<div className="mt-2">{reportData}</div>)}
      </div>
    </>
  )
}
