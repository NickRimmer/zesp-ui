import React, {ReactNode, useState} from "react";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";

export interface IProps {
  children?: ReactNode
  title: string,
}

export const DeviceDialog = (props: IProps) => {
  const history = useHistory();
  const [show, setShow] = useState(true);

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit} size="lg">
      <Modal.Header closeButton>{props.title}</Modal.Header>
      <Modal.Body className="text-start">
        {props.children}
      </Modal.Body>
    </Modal>
  )
}