import React from "react";
import {Col, Row} from "react-bootstrap";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {HighlightOnUpdate} from "../../shared/transition/HighlightOnUpdate";
import {DataLayoutItem} from "../../models/DataLayoutItem";

export const OnOffBinarySensor = (props: IDeviceControlProps<DataLayoutItem>) => {
  const report = DeviceControls.getControlReport(props);
  if (!report) return (<div className="alert alert-warning">Report missed</div>);
  const payloadOn = Number(props.config.zespRoleSettings["payload_on"]?.toString() || "0");
  const value = Number(report.val?.toString() || "1") === payloadOn;

  return (
    <Row>
      <Col md="3" lg="2">{report.label || "State"}:</Col>
      <Col>
        <HighlightOnUpdate>{value ? "ON" : "OFF"}</HighlightOnUpdate>
      </Col>
    </Row>
  )
}
