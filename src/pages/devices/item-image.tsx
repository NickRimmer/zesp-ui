import React from "react";
import {DeviceInfo} from "../../models/DeviceInfo";

interface IProps {
  device: DeviceInfo
}

export default (props: IProps) => {
  const deviceImage = getDeviceImageSrc(props.device);
  const src = `${process.env.PUBLIC_URL}/device-images/${deviceImage}`;
  return (<div className="item-image" style={{backgroundImage: `url(${src})`}}/>);
}

function getDeviceImageSrc(device: DeviceInfo): string {
  if (!device.settings) return "zigbee.png";
  return device.settings.image;
}