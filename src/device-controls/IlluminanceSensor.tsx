import React from "react";
import {LayoutSettingsSensor} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {Col, Row} from "react-bootstrap";

//TODO localization
export const IlluminanceSensor = (props: IDeviceControlProps<LayoutSettingsSensor>) => {
  console.log(props);
  return (
    <Row>
      <Col md="3" lg="2">Illuminance:</Col>
      <Col>{props.config.report?.val || (
        <span className="alert alert-warning small py-2 m-0">No data</span>
      )}</Col>
    </Row>
  )
}