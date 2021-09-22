import React from "react";
import {Row} from "react-bootstrap";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {HighlightOnUpdate} from "../../shared/transition/HighlightOnUpdate";
import {DataControlSettings} from "../../models/DataControlSettings";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

export const ValueSensor = (props: IDeviceControlProps<DataControlSettings>) => {
  const report = DeviceControls.getControlReport(props);
  if (!report) return (<div className="alert alert-warning">Report missed</div>);

  const value = report.parsed || report.val;
  const unit = (props.config.zespRoleSettings && props.config.zespRoleSettings["unit_of_measurement"]) || "";

  return (
    <Row>
      <DeviceControlCol1>{report.label || "Value"}:</DeviceControlCol1>
      <DeviceControlCol2>
        <HighlightOnUpdate>{value ? `${value} ${unit}` : "No data"}</HighlightOnUpdate>
      </DeviceControlCol2>
    </Row>
  )
}
