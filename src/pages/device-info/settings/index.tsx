import React, {useState} from "react";
import useHook from "./hook";
import {AppDialog} from "../../../shared/app-dialog";
import {Row, Col, Form, Button} from "react-bootstrap";
import {DeviceInfo} from "../../../models/DeviceInfo";

interface IProps {
  onClosed: () => void,
  device: DeviceInfo,
}

export const DeviceSettings: React.FC<IProps> = ({
  device,
  onClosed
}): React.ReactElement => {
  const {
    forceClose,
    // deviceData,

    onCancelHandler,
    onSaveHandler,
  } = useHook(device);

  const [name, setName] = useState(device.zespInfo.Name || "");
  const [location, setLocation] = useState(device.zespInfo.Location || "");

  // if (!deviceData) {
  //   return (<CustomSpinner message="Read settings..."/>)
  // }

  // console.log(deviceData["ModelId"]);
  const footer = (
    <>
      <Button onClick={() => onSaveHandler(name, location)}>Save changes</Button>
      <Button variant="secondary" role="cancel" onClick={onCancelHandler}>Cancel</Button>
    </>
  )

  return (
    <AppDialog title="Device settings" onClosed={onClosed} footer={footer} forceClose={forceClose}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">Display name</Form.Label>
        <Col><Form.Control value={name} onChange={event => setName(event.target.value)} placeholder={device.zespInfo.ModelId}/></Col>
      </Form.Group>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">Location</Form.Label>
        <Col><Form.Control value={location} onChange={event => setLocation(event.target.value)} placeholder="Default"/></Col>
      </Form.Group>
    </AppDialog>
  )
}

export default DeviceSettings;
