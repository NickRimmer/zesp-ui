import React, {useEffect, useState} from "react";
import {DeviceListItem} from "../../models/DeviceListItem";

interface IProps {
  device: DeviceListItem
}

const defaultImage = "/device-images/default.png";

export default (props: IProps) => {
  const [image, setImage] = useState(props.device.image);

  useEffect(() => {
    const testImage = new Image();
    testImage.onerror = () => {
      setImage(defaultImage);
    }
    testImage.src = image;
  }, []);

  return (<div className="item-image" style={{backgroundImage: `url(${image})`}}/>);
}