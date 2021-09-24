import React, {useEffect, useRef, useState} from "react";
import "./styles.scss"
import {Modal, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {getSpinner} from "../../store/slices/spinnerSlice";

export const LoadingSpinner = () => {
  const {spinnerShow, spinnerMessage} = useSelector(getSpinner);
  const [show, setShow] = useState(spinnerShow);
  const showTimerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current)
      showTimerRef.current = undefined
    }
    if (spinnerShow) showTimerRef.current = setTimeout(() => setShow(true), 1000);
    else setShow(false)
  }, [spinnerShow])

  return (
    <Modal show={show} centered size="sm" backdrop={true}>
      <Modal.Body>
        <div className="d-flex align-items-center">
          <Spinner animation="border" variant="primary" className="me-3"/>
          <div>{spinnerMessage}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export const CustomSpinner: React.FC<{ message: string }> = ({message}) => {
  return (
    <Modal show={true} centered size="sm" backdrop={true}>
      <Modal.Body>
        <div className="d-flex align-items-center">
          <Spinner animation="border" variant="primary" className="me-3"/>
          <div>{message}</div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default LoadingSpinner;