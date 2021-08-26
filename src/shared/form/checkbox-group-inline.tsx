import React from "react";
import {Form} from "react-bootstrap";

type IProps = {
  defaultChecked?: boolean | number | string;
  controlId: string;
  label: string;
  checkedValue?: string | number | boolean | undefined;
  uncheckedValue?: string | number | boolean | undefined;
};

const Result = ({controlId, label, defaultChecked, checkedValue = "true", uncheckedValue = "false"}: IProps) => {
  const defaultCheckedBool =
    defaultChecked === "true" ||
    defaultChecked === "1" ||
    defaultChecked === 1 ||
    defaultChecked === true ||
    false;

  let props = {checked_value: checkedValue, unchecked_value: uncheckedValue};
  if (defaultChecked) props = ({...props, ...{defaultChecked: defaultCheckedBool}});

  return (
    <Form.Group controlId={controlId} className="d-inline-block">
      <Form.Label className="d-flex">
        <Form.Check className="pe-2" {...props}/><span>{label}</span>
      </Form.Label>
    </Form.Group>
  );
}

export default Result;