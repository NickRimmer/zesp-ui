import React, {useState} from "react";
import {Modal} from "react-bootstrap";
import {useParams, NavLink, useHistory} from "react-router-dom";

export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();
  const [show, setShow] = useState(true);
  const history = useHistory();

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);
  const handleCloseLink = (event: React.MouseEvent) => {
    event.preventDefault();
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit}>
      <Modal.Header closeButton>Not implemented yet</Modal.Header>
      <Modal.Body>
        <p>Device: <span className="badge bg-info">{ieee} ({device})</span></p>
        <p>
          Hello, my dear friend! Just imagine how awesome this feature can be and share it with developers ~_~ <br/>
          Or you can even implement it yourself, everything you need is just to jump to source codes, made some magic, test it and that's it!
        </p>
        <p>
          <NavLink to="/devices" onClick={handleCloseLink}>Go back for now</NavLink>
        </p>
      </Modal.Body>
    </Modal>
  );
}