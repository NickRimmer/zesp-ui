import React from "react";
import {Col, Row} from "react-bootstrap";
import {LayoutSettingsSensor} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Transition} from "../../shared/transition";
import {DeviceControls} from "../../services/deviceControls";

//TODO localization
export const IlluminanceSensor = (props: IDeviceControlProps<LayoutSettingsSensor>) => {
  const report = DeviceControls.extractReport(props);

  return (
    <Row>
      <Col md="3" lg="2">Illuminance:</Col>
      <Col>
        {report?.val && (
          <Transition classNameFrom="highlight-value just-added" classNameTo="highlight-value" onRefresh={true} onLoad={false}>{report?.val}</Transition>)}
        {!report?.val && (<span className="alert alert-warning small py-2 m-0">No data</span>)}
      </Col>
    </Row>
  )
}
