import React from "react";
import {DeviceListItem} from "../../models/DeviceListItem";

interface IProps {
  device: DeviceListItem
}

export default (props: IProps) => {
  return (<div className="item-image" style={{backgroundImage: `url(${props.device.image})`}}/>);
}