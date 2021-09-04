import React from "react";
import {Row} from "react-bootstrap";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {HighlightOnUpdate} from "../../shared/transition/HighlightOnUpdate";
import {DataLayoutItem} from "../../models/DataLayoutItem";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

export const OnOffBinarySensor = (props: IDeviceControlProps<DataLayoutItem>) => {
  const report = DeviceControls.getControlReport(props);
  if (!report) return (<div className="alert alert-warning">Report missed</div>);
  const payloadOn = Number(props.config.zespRoleSettings["payload_on"]?.toString() || "0");
  const value = Number(report.parsed?.toString() || report.val?.toString() || "1");
  const result = value === payloadOn;

  return (
    <Row>
      <DeviceControlCol1>{report.label || "State"}:</DeviceControlCol1>
      <DeviceControlCol2>
        <HighlightOnUpdate>{result ? "ON" : "OFF"}</HighlightOnUpdate>
      </DeviceControlCol2>
    </Row>
  )
}