import React from "react";
import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import ItemImage from "./item-image";

interface IProps {
  device: DeviceInfo
}

export default (props: IProps) => {
  const title = props.device.Name && props.device.Name.length > 0 ? props.device.Name : props.device.ModelId
  // const tags = ["root", "light", "speaker"];
  let tags: string[] = [];
  for (const key of Object.keys(props.device.Report))
    tags.push(props.device.Report[key].reportIdInfo.name);

  // remove duplicates and unknown 
  tags = tags
    .filter((x, i) => x !== "unknown" && tags.indexOf(x) == i)
    .sort((a, b) => a > b ? 1 : -1);

  return (<a href="#" className="item p-3 border rounded">
    <div className="d-flex">
      <div><ItemImage device={props.device}/></div>
      <div className="ps-2">
        <div className="title">{title}</div>
        <div className="ieee text-muted small"><span className="badge bg-info me-1">{props.device.Device}</span>{props.device.IEEE}</div>
        {tags.length > 0 && (
          <div className="badges small">
            {tags.map((x, i) => (<span key={i} className="badge bg-secondary">{x}</span>))}
          </div>
        )}
      </div>
    </div>
  </a>);
}