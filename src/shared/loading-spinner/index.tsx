import React from "react";
import "./styles.scss"
import {Modal, Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {getSpinner} from "../../store/slices/spinnerSlice";

export const LoadingSpinner = () => {
  const {spinnerShow, spinnerMessage} = useSelector(getSpinner);

  return (
    <Modal show={spinnerShow} centered size="sm" backdrop={true}>
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