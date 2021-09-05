import React, {useEffect, useState} from "react";
import {DeviceInfo} from "../../models/DeviceInfo";
import {Single} from "../../services/single";

interface IProps {
  device: DeviceInfo
}

export default (props: IProps) => {
  const [image, setImage] = useState(`${process.env.PUBLIC_URL}/device-images/default.png`);
  useEffect(() => {
    const timer = setTimeout(() => {
      // set default
      setImage(`${process.env.PUBLIC_URL}/device-images/zigbee.png`)
    }, 2000);

    getDeviceImageSrc(props.device, (image) => {
      clearTimeout(timer);
      setImage(image);
    });
  }, []);

  return (<div className="item-image" style={{backgroundImage: `url(${image})`}}/>);
}

function getDeviceImageSrc(device: DeviceInfo, setImage: (image: string) => void): void {
  // if we have image specified in settings
  if (device.settings?.image) {
    setImage(`${process.env.PUBLIC_URL}/device-images/${device.settings?.image}`);
    return;
  }

  // if zesp returns image property
  if (device.zespInfo.Img) {
    const serverAddress = Single.ZespConnector.getServerAddress();
    setImage(`http://${serverAddress}:8081/${device.zespInfo.Img}`);
    return;
  }

  // try to get image by device id from zesp
  try {
    const modelId = device.zespInfo.ModelId;
    const serverAddress = Single.ZespConnector.getServerAddress();
    const zespImage = `http://${serverAddress}:8081/img/${modelId}.jpg`;

    const image = new Image();

    image.onload = () => {
      if (image.width > 0) {
        console.debug(`Image found on zesp for device '${device.zespInfo.ModelId}'`);
        setImage(zespImage);
      }
    }

    console.debug(`Looking for image... '${zespImage}'`);
    image.src = zespImage;
  } catch {
    // it's ok
  }
}