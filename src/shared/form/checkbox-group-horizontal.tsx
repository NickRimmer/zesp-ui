import React from "react";
import {Col, Form, Row} from "react-bootstrap";

type Props = {
  checked?: boolean;
  defaultChecked?: boolean;
  controlId: string;
  label: string;
};

const Result = ({controlId, label, checked, defaultChecked}: Props) => {
  let props = {};
  if (checked) props = ({...props, ...{checked}});
  if (defaultChecked) props = ({...props, ...{defaultChecked}});

  return (
    <Form.Group as={Row} className="mb-3" controlId={controlId}>
      <Form.Label column md="3" lg="2">{label}</Form.Label>
      <Col>
        <Form.Check {...props}/>
      </Col>
    </Form.Group>
  );
}

export default Result;