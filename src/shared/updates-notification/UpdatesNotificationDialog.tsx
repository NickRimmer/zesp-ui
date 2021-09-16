import React, {useState} from "react";
import {DictionaryStrings} from "../../models/DictionaryStrings";
import {Col, Modal, Row} from "react-bootstrap";

const UpdatesNotificationDialog: React.FC<{ onClosed: () => void }> = ({onClosed}): React.ReactElement => {
  const [show, setShow] = useState(true);
  const onHideHandler = () => setShow(false);
  const updateData: DictionaryStrings = {
    "ModelId": "ZESP",
    "board": "esp32",
    "link": "http:/82.146.46.112/fw/zesp.bin",
    "ver": "Beta16092021",
    "Manufacturer": "VLK_SW",
    "Description": " "
  };

  return (
    <Modal show={show} onExited={onClosed} onHide={onHideHandler}>
      <Modal.Header>
        <div>New version of ZESP Firmware</div>
        <div className="text-end modal-right-buttons">
          <button type="button" className="btn-close me-1" aria-label="Close" onClick={onHideHandler}/>
        </div>
      </Modal.Header>
      <Modal.Body className="text-start">
        <div className="rows-striped">
          {Object.keys(updateData).map((key, i) => {
            return updateData[key]
              && updateData[key].trim().length > 0
              && (<Row><Col xs={4} className="py-2 text-capitalize text-muted text-end">{key}</Col><Col className="py-2 text-dark">{updateData[key]}</Col></Row>);
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary">Update now</button>
        <button className="btn btn-secondary">Skip this version</button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdatesNotificationDialog;