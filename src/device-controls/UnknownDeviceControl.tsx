import React from "react";
import {DeviceControlInfo} from "../models/DeviceControlInfo";

interface IProps {
  data: DeviceControlInfo
}

export const UnknownDeviceControl = (props: IProps) => {
  return (
    <div>Unknown control: {props.data.id}</div>
  )
}
