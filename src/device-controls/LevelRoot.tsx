import React, {useState} from "react";
import {LayoutSettingsLevel, LayoutSettingsOnOff} from "./settings";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {Button, ButtonGroup, Col, FormControl, Row} from "react-bootstrap";
import {Single} from "../services/single";
import FormRange from "react-bootstrap/FormRange";

// TODO add localization
export const LevelRoot = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  //TODO get current value
  const [value, setValue] = useState(50);
  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);

  const sliderChangeHandler = () => {
    const result = inRange(value);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    Single.ZespConnector.send({data: data});
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    Single.ZespConnector.send({data: data});
  }

  return (
    <Row>
      <Col md="3" lg="2">Level:</Col>
      <Col>
        <FormControl
          style={{width: "80px"}}
          className="me-2"
          type="number"
          value={value}
          onChange={event => inputChangeHandler(Number(event.target.value))}
          {...minMaxAttributes}
        />

        <FormRange
          value={value}
          onChange={event => setValue(Number(event.target.value))}
          onMouseUp={sliderChangeHandler}
          {...minMaxAttributes}
        />
      </Col>
    </Row>
  )
}
