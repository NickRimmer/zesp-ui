import React, {useContext, useState} from "react";
import {FormControl, Row} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";
import {LayoutSettingsLevel} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "../index";
import {ZespContext} from "../../shared/agents/ZespAgent";

export const LevelControl = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  const {zespSend} = useContext(ZespContext);
  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const report = DeviceControls.getControlReport(props);
  const currentValue = report?.parsed ? Number(report.parsed) : ((minMaxAttributes.max - minMaxAttributes.min) / 2 + minMaxAttributes.min);
  const [value, setValue] = useState(currentValue);

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);

  const sliderChangeHandler = () => {
    const result = inRange(value);
    sendValueToZesp(result);
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);
    sendValueToZesp(result);
  }

  const sendValueToZesp = (value: number) => {
    const data = formatCommand(props.config.arguments.command, value, props);
    zespSend({data: data});
  }

  const label = report?.label || props.config.name || "Level";

  return (
    <Row>
      <DeviceControlCol1>{label}:</DeviceControlCol1>
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

const formatCommand = (command: string, value: number, props: IDeviceControlProps<LayoutSettingsLevel>): string => command
  .replace("{device}", props.deviceInfo.zespInfo.Device)
  .replace("{value}", value.toString(16))
  .replace("{value:dec}", value.toString());