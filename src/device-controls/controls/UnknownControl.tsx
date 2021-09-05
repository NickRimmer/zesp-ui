import React from "react";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DataControlSettings} from "../../models/DataControlSettings";
import {DeviceControls} from "../../services/deviceControls";

export const UnknownControl = (props: IDeviceControlProps<DataControlSettings>) => {
  const configData = JSON.stringify(props.config)
  const reportData = JSON.stringify(DeviceControls.getControlReport(props));

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