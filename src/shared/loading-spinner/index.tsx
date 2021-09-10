import React from "react";
import "./styles.scss"
import {Spinner} from "react-bootstrap";
import {useSelector} from "react-redux";
import {getSpinnerShow} from "../../store/slices/spinnerSlice";

const LoadingSpinner = () => {
  const spinnerShow = useSelector(getSpinnerShow);
  return (
    <div className={`loading-overlay ${spinnerShow ? "show" : "hidden"}`}>
      <Spinner animation="border" variant="light"/>
    </div>
  );
}

export default LoadingSpinner;