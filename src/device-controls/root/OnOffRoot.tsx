import React, {useContext} from "react";
import {Button, ButtonGroup, Row} from "react-bootstrap";
import {LayoutSettingsOnOff} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "../index";
import {ZespContext} from "../../shared/agents/ZespAgent";

export const OnOffRoot = (props: IDeviceControlProps<LayoutSettingsOnOff>) => {
  const {zespSend} = useContext(ZespContext);
  const report = DeviceControls.getControlReport(props);

  const onHandler = () => {
    zespSend({data: props.config.arguments.commandOn, isBinary: true});
  };

  const offHandler = () => {
    zespSend({data: props.config.arguments.commandOff, isBinary: true});
  };

  return (
    <Row>
      <DeviceControlCol1>Light power:</DeviceControlCol1>
      <DeviceControlCol2>
        <ButtonGroup>
          <Button variant={report?.val.toString() === "1" ? "primary" : "secondary"} onClick={onHandler}>ON</Button>
          <Button variant={report?.val.toString() === "1" ? "secondary" : "primary"} onClick={offHandler}>OFF</Button>
        </ButtonGroup>
      </DeviceControlCol2>
    </Row>
  )
}
