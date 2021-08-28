import React from "react";
import {Col, Form, Row} from "react-bootstrap";

type Props = {
  defaultValue?: string | number | boolean | undefined;
  controlId: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password";
};

const Result = ({controlId, label, placeholder, defaultValue, type = "text"}: Props) => {
  let inputProps = ({
    placeholder,
    type
  });

  if (defaultValue) inputProps = ({...inputProps, ...{defaultValue: defaultValue.toString()}});

  return (
    <Form.Group as={Row} className="mb-3" controlId={controlId}>
      <Form.Label column md="3" lg="2">{label}</Form.Label>
      <Col>
        <Form.Control {...inputProps} />
      </Col>
    </Form.Group>
  );
}

export default Result;
