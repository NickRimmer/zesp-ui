import React, {ReactNode, useState} from "react";
import "./styles.scss";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

export interface IProps {
  children?: ReactNode
  title: string,
  onDetailsClicked?: () => void
}

export const DeviceDialog = (props: IProps) => {
  const history = useHistory();
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit} size="lg">
      <Modal.Header className="">
        <div>{props.title}</div>
        <div className="text-end">
          <span>
            {props.onDetailsClicked && (<button type="button" className="btn" onClick={props.onDetailsClicked}><i className="bi bi-archive"/></button>)}
          </span>
          <span className="border-end mx-3"/>
          <button type="button" className="btn-close" aria-label="Close" onClick={() => setShow(!show)}/>
        </div>
      </Modal.Header>
      <Modal.Body className="text-start device-dialog">
        {props.children}
      </Modal.Body>
    </Modal>
  )
}