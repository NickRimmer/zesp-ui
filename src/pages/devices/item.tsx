import React from "react";
import ItemImage from "./item-image";
import {NavLink} from "react-router-dom";
import {DeviceListItem} from "../../models/DeviceListItem";

interface IProps {
  device: DeviceListItem
}

export default (props: IProps) => {
  const {device} = props;
  const detailsLink = `/devices/${device.ieee}`;

  return (
    <NavLink className="item p-3 border rounded" to={detailsLink}>
      <div className="d-flex">
        <div><ItemImage device={props.device}/></div>
        <div className="ps-2">
          <div className="title">{device.title}</div>
          <div className="ieee text-muted small">{device.ieee}</div>
          {device.tags.length > 0 && (
            <div className="badges small">
              {device.tags.map((x, i) => (<span key={i} className="badge bg-secondary">{x}</span>))}
            </div>
          )}
        </div>
      </div>
    </NavLink>
  );
}