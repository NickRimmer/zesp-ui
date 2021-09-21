import React, {useState} from "react";
import useHook from "./hook";
import {Row, Col, Form, Button} from "react-bootstrap";
import {DeviceInfo} from "../../models/DeviceInfo";
import {AppDialog} from "../app-dialog";

interface IProps {
  device: DeviceInfo,

  onClosed: () => void,
}

export const DeviceSettingsDialog: React.FC<IProps> = ({
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

  const saveHandler = () => onSaveHandler(name, location)

  const footer = (
    <>
      <Button type="submit">Save changes</Button>
      <Button variant="secondary" role="cancel" onClick={onCancelHandler}>Cancel</Button>
    </>
  )

  return (
    <AppDialog title="Device settings" onClosed={onClosed} footer={footer} forceClose={forceClose} onSubmit={saveHandler}>
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

export default DeviceSettingsDialog;