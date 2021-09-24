import React from "react";
import ItemImage from "./item-image";
import {NavLink} from "react-router-dom";
import {DeviceListItem} from "../../models/DeviceListItem";
import {Col} from "react-bootstrap";

interface IProps {
  device: DeviceListItem
}

export default (props: IProps) => {
  const {device} = props;
  const detailsLink = `/devices/${device.ieee}`;

  return (
    <Col xs={12} sm={6} lg={4} xxl={3} className="p-1">
      <NavLink className="item p-3 border rounded d-block" to={detailsLink}>
        <div className="d-flex">
          <div><ItemImage device={props.device}/></div>
          <div className="ps-2">
            <div className="title">{device.title}</div>
            <div className="ieee text-muted small">{device.ieee}</div>
            {device.tags.length > 0 && (
              <div className="badges small text-wrap">
                {device.tags.map((x, i) => (<span key={i} className="badge bg-secondary">{x}</span>))}
              </div>
            )}
          </div>
        </div>
      </NavLink>
    </Col>
  );
}
