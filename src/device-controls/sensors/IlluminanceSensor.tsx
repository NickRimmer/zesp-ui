import React from "react";
import {Col, Row} from "react-bootstrap";
import {LayoutSettingsSensor} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {HighlightOnUpdate} from "../../shared/transition/HighlightOnUpdate";

//TODO localization
export const IlluminanceSensor = (props: IDeviceControlProps<LayoutSettingsSensor>) => {
  const report = DeviceControls.getControlReport(props);
  const value = report?.val ? parseInt(report.val, 16).toString() : null;

  return (
    <Row>
      <Col md="3" lg="2">Illuminance:</Col>
      <Col>
        {value && (<HighlightOnUpdate>{value}</HighlightOnUpdate>)}
        {!value && (<span className="alert alert-warning small py-2 m-0">No data</span>)}
      </Col>
    </Row>
  )
}
