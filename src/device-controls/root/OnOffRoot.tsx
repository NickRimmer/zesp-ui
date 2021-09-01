import React from "react";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import {LayoutSettingsOnOff} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Single} from "../../services/single";
import {DeviceControls} from "../../services/deviceControls";

// TODO add localization
export const OnOffRoot = (props: IDeviceControlProps<LayoutSettingsOnOff>) => {
  const report = DeviceControls.extractReport(props);

  const onHandler = () => {
    Single.ZespConnector.send({data: props.config.arguments.commandOn, isBinary: true});
  };

  const offHandler = () => {
    Single.ZespConnector.send({data: props.config.arguments.commandOff, isBinary: true});
  };

  return (
    <Row>
      <Col md="3" lg="2">Light power:</Col>
      <Col>
        <ButtonGroup>
          <Button variant={report?.val.toString() === "1" ? "primary" : "secondary"} onClick={onHandler}>ON</Button>
          <Button variant={report?.val.toString() === "1" ? "secondary" : "primary"} onClick={offHandler}>OFF</Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}
