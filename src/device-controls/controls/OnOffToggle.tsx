import React from "react";
import {Button, ButtonGroup, Row} from "react-bootstrap";
import {LayoutSettingsOnOffToggle} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {Single} from "../../services/single";
import {DeviceControls} from "../../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

export const OnOffToggle = (props: IDeviceControlProps<LayoutSettingsOnOffToggle>) => {
  const report = DeviceControls.getControlReport(props);

  const onHandler = () => {
    const command = props.config.arguments.commandOn.replace("{device}", props.deviceInfo.zespInfo.Device)
    Single.ZespConnector.send({data: command, isBinary: true});
  };

  const offHandler = () => {
    const command = props.config.arguments.commandOff.replace("{device}", props.deviceInfo.zespInfo.Device)
    Single.ZespConnector.send({data: command, isBinary: true});
  };

  const toggleHandler = () => {
    const command = props.config.arguments.commandToggle.replace("{device}", props.deviceInfo.zespInfo.Device)
    Single.ZespConnector.send({data: command, isBinary: true});
  }

  const label = report?.label || "Power";

  return (
    <Row>
      <DeviceControlCol1>{label}:</DeviceControlCol1>
      <DeviceControlCol2>
        <ButtonGroup>
          <Button variant={report?.parsed.toString() === "1" ? "primary" : "secondary"} onClick={onHandler}>ON</Button>
          <Button variant="secondary" onClick={toggleHandler}>Toggle</Button>
          <Button variant={report?.parsed.toString() === "0" ? "primary" : "secondary"} onClick={offHandler}>OFF</Button>
        </ButtonGroup>
      </DeviceControlCol2>
    </Row>
  )
}
