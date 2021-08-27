import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import React from "react";

interface IProps {
  device: DeviceInfo
}

export default (props: IProps) => {
  const deviceImage = getDeviceImageSrc(props.device);
  const src = `/device-images/${deviceImage}`;
  return (<div className="item-image" style={{backgroundImage: `url(${src})`}}/>);
}

function getDeviceImageSrc(device: DeviceInfo): string {
  const images = require("./item-images.json"); // eslint-disable-line @typescript-eslint/no-var-requires

  // zesp root device
  if (device.Device === "0000") return images.default.root;

  // console.log(reports);
  return images.default.unknown;
}