import React from "react";
import useHook from "./hook";
import {AppDialog} from "../../../shared/app-dialog";
import {Col, Dropdown, Form, ProgressBar, Row} from "react-bootstrap";

interface IProps {
  onClosed: () => void,
}

export const AddZigbeeDialog: React.FC<IProps> = ({
  onClosed
}): React.ReactElement => {

  const {
    isCompleted,
    logs,
    onChannelChangedHandler
  } = useHook();

  const channels: React.ReactElement[] = []
  for (let channel = 11; channel <= 26; channel++)
    channels.push(<option>{channel}</option>);

  return (
    <AppDialog title="Add Zigbee device" onClosed={onClosed} className="add-zigbee-dialog">
      {!isCompleted && (
        <>
          <Row className="mb-3 align-items-center">
            <Col>I'm ready to pair new devices on channels:</Col>
            <Col xs={3}>
              <Form.Select className="d-inline-block" onChange={event => onChannelChangedHandler(event.currentTarget.value)}>
                <option value="">All</option>
                {channels}
              </Form.Select>
            </Col>
          </Row>

          <ProgressBar animated={true} striped={true} now={100}/>
        </>
      )}
      {isCompleted && (
        <>
          <p>Pairing completed. To set device template or edit reports, click to device and choose <span className="badge bg-secondary">Edit</span> in settings.</p>
          <ProgressBar now={100} variant="success" label="Completed"/>
        </>
      )}
      {logs.length > 0 && (<div className="logs" dangerouslySetInnerHTML={{__html: logs}}/>)}
    </AppDialog>
  )
}

export default AddZigbeeDialog;