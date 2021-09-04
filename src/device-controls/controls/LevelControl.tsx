import React, {useState} from "react";
import {FormControl, Row} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";
import {LayoutSettingsLevel} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Single} from "../../services/single";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceControls} from "../../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

// TODO add localization
export const LevelControl = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  const globalState = useGlobalState();
  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const report = DeviceControls.getControlReport(props);
  const currentValue = report?.val ? Number(report.val) : ((minMaxAttributes.max - minMaxAttributes.min) / 2 + minMaxAttributes.min);
  const [value, setValue] = useState(currentValue);

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);
  const setReportValue = (value: number) => DeviceControls.setControlReport(globalState, props, value.toString())

  const sliderChangeHandler = () => {
    const result = inRange(value);
    const data = formatCommand(props.config.arguments.command, result);
    Single.ZespConnector.send({data: data});
    setReportValue(result);
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);

    const data = formatCommand(props.config.arguments.command, result);
    Single.ZespConnector.send({data: data});
    setReportValue(result);
  }

  return (
    <Row>
      <DeviceControlCol1>{props.config.label || "Level"}:</DeviceControlCol1>
      <DeviceControlCol2>
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
      </DeviceControlCol2>
    </Row>
  )
}

const formatCommand = (command: string, value: number): string => command
  .replace("{value}", value.toString(16))
  .replace("{value:dec}", value.toString());