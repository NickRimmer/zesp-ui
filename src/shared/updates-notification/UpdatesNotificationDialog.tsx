import React, {useState} from "react";
import {DictionaryStrings} from "../../models/DictionaryStrings";
import {Col, Modal, Row} from "react-bootstrap";
import toast from "react-hot-toast";

interface IProps {
  zespFirmwareUpdate: DictionaryStrings,
  zespFirmwareCurrentVersion: string,
  onClosed: () => void,
}

const UpdatesNotificationDialog: React.FC<IProps> = ({
  onClosed,
  zespFirmwareUpdate,
  zespFirmwareCurrentVersion
}): React.ReactElement => {
  const [show, setShow] = useState(true);

  const onHideHandler = () => setShow(false);

  const zespFirmwareUpdateVersion = zespFirmwareUpdate["ver"] || "unknown";

  const updateData: DictionaryStrings = {
    ...{"Current version": zespFirmwareCurrentVersion},
    ...{"New version": zespFirmwareUpdateVersion},
    ...{...zespFirmwareUpdate, ...{"ver": undefined}} // skip ver from "other" properties, cause we'll show it before
  }

  const onUpdateClickHandler = () => {
    toast.success("Not implemented yet...", {icon: (<i className="bi bi-cone-striped text-warning"/>)});
  }

  const onSkipClickHandler = () => {
    toast.success("Not implemented yet...", {icon: (<i className="bi bi-cone-striped text-warning"/>)});
  }

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
              && updateData[key]!.trim().length > 0
              && (<Row><Col xs={4} className="py-2 text-capitalize text-muted text-end">{key}</Col><Col className="py-2 text-dark">{updateData[key]}</Col></Row>);
          })}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-primary" onClick={onUpdateClickHandler}>Update ZESP service</button>
        <button className="btn btn-secondary" onClick={onSkipClickHandler}>Skip this version</button>
      </Modal.Footer>
    </Modal>
  )
}

export default UpdatesNotificationDialog;