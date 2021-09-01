import React, {useState} from "react";
import {Col, FormControl, Row} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";
import {LayoutSettingsLevel} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Single} from "../../services/single";
import {ZespService} from "../../services/zesp";

// TODO add localization
export const LevelControl = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const currentValue = props.config.report?.val ? Number(props.config.report.val) : ((minMaxAttributes.max - minMaxAttributes.min) / 2);
  const [value, setValue] = useState(currentValue);

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);

  const setCurrentValue = (value: number) => {
    if (props.config.report)
      ZespService.general.setReportValue(props.deviceInfo.IEEE, props.config.report?.details, value.toString());
  }

  const sliderChangeHandler = () => {
    const result = inRange(value);
    const data = formatCommand(props.config.arguments.command, result);
    Single.ZespConnector.send({data: data});
    setCurrentValue(result);
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);

    const data = formatCommand(props.config.arguments.command, result);
    Single.ZespConnector.send({data: data});
    setCurrentValue(result);
  }

  return (
    <Row>
      <Col md="3" lg="2">{props.config.label || "Level"}:</Col>
      <Col>
        <FormControl
          style={{width: "100px"}}
          className="me-2 text-center"
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

const formatCommand = (command: string, value: number): string => command
  .replace("{value}", value.toString(16))
  .replace("{value:dec}", value.toString());