import React from "react";
import {LayoutSettingsOnOff} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {Button, ButtonGroup, Col, Row} from "react-bootstrap";
import {Single} from "../services/single";

export const OnOffRoot = (props: IDeviceControlProps<LayoutSettingsOnOff>) => {
  const onHandler = () => {
    Single.ZespConnector.send({data: props.config.arguments.commandOn, isBinary: true});
  };

  const offHandler = () => {
    Single.ZespConnector.send({data: props.config.arguments.commandOff, isBinary: true});
  };

  return (
    <>
      <Row>
        <Col className="d-flex align-items-center" md="3" lg="2">Light power:</Col>
        <Col>
          <ButtonGroup>
            <Button variant="primary" onClick={onHandler}>ON</Button>
            <Button variant="secondary" onClick={offHandler}>OFF</Button>
          </ButtonGroup>
        </Col>
      </Row>
    </>
  )
}
