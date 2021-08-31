import React from "react";
import {LayoutSettingsOnOff} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import {Single} from "../services/single";

// TODO add localization
export const OnOffRoot = (props: IDeviceControlProps<LayoutSettingsOnOff>) => {
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
          <Button variant={props.config.report?.val.toString() === "1" ? "primary" : "secondary"} onClick={onHandler}>ON</Button>
          <Button variant={props.config.report?.val.toString() === "1" ? "secondary" : "primary"} onClick={offHandler}>OFF</Button>
        </ButtonGroup>
      </Col>
    </Row>
  )
}
