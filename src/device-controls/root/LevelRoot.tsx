import React, {useContext, useState} from "react";
import {FormControl, Row} from "react-bootstrap";
import FormRange from "react-bootstrap/FormRange";
import {LayoutSettingsLevel} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "../index";
import {ZespContext} from "../../shared/agents/ZespAgent";

// TODO add localization
export const LevelRoot = (props: IDeviceControlProps<LayoutSettingsLevel>) => {
  const {zespSend} = useContext(ZespContext);
  const report = DeviceControls.getControlReport(props);
  const currentValue = report?.val ? Number(report.val) : ((props.config.arguments.max - props.config.arguments.min) / 2 + props.config.arguments.min);
  const [value, setValue] = useState(currentValue);

  const minMaxAttributes = {
    min: props.config.arguments.min,
    max: props.config.arguments.max
  };

  const inRange = (value: number) => Math.max(Math.min(props.config.arguments.max, value), props.config.arguments.min);

  // const setCurrentValue = (value: number) => DeviceControls.setControlReport(globalState, props, value.toString());

  const sliderChangeHandler = () => {
    const result = inRange(value);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    zespSend({data: data});
    // setCurrentValue(result);
  }

  const inputChangeHandler = (value: number) => {
    const result = inRange(value);
    setValue(result);
    const data = props.config.arguments.command.replace("{value}", result.toString(16));
    zespSend({data: data});
    // setCurrentValue(result);
  }

  return (
    <Row>
      <DeviceControlCol1>Level:</DeviceControlCol1>
      <DeviceControlCol2>
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
      </DeviceControlCol2>
    </Row>
  )
}
