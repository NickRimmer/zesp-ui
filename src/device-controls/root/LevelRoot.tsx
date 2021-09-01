import React, {useState} from "react";
import {Col, FormControl, Row} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";
import {LayoutSettingsLevel} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Single} from "../../services/single";
import {ZespService} from "../../services/zesp";

// TODO add localization
export const LevelRoot = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  const currentValue = props.config.report?.val ? Number(props.config.report.val) : 50;
  const [value, setValue] = useState(currentValue);

  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);

  const setCurrentValue = (value: number) => {
    if (props.config.report)
      ZespService.general.setReportValue(props.deviceInfo.IEEE, props.config.report?.details, value.toString());
  }

  const sliderChangeHandler = () => {
    const result = inRange(value);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    Single.ZespConnector.send({data: data});
    setCurrentValue(result);
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    Single.ZespConnector.send({data: data});
    setCurrentValue(result);
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
