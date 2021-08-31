import React, {ReactNode, useState} from "react";
import "./styles.scss";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

export interface IProps {
  children?: ReactNode
  title: string,
  onDetailsClicked?: () => void,
  groups?: string[],
}

export const DeviceDialog = (props: IProps) => {
  const history = useHistory();
  const [show, setShow] = useState(true);
  const groups = props.groups || [];

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit} size="lg">
      <Modal.Header className={groups.length > 0 ? "with-tabs" : ""}>
        {groups.length > 0 && (
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button type="button" className="btn btn-light nav-link active">{props.title}</button>
            </li>
            <li className="nav-item">
              <button type="button" className="btn btn-light nav-link">Playback</button>
            </li>
          </ul>
        )}

        {groups.length == 0 && (
          <div>{props.title}</div>
        )}

        <div className="text-end modal-right-buttons">
          <span>
            {props.onDetailsClicked && (<button type="button" className="btn" onClick={props.onDetailsClicked}><i className="bi bi-archive"/></button>)}
          </span>
          <span className="border-end mx-3"/>
          <button type="button" className="btn" onClick={() => setShow(!show)}><i className="bi bi-x-lg"/></button>
        </div>
      </Modal.Header>
      <Modal.Body className="text-start device-dialog">
        {props.children}
      </Modal.Body>
    </Modal>
  )
}