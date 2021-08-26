import React from "react";
import {Col, Form, Row} from "react-bootstrap";

type Props = {
  value?: string | number | boolean | undefined;
  defaultValue?: string | number | boolean | undefined;
  controlId: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password";
};

const Result = ({controlId, label, placeholder, defaultValue, type = "text", value}: Props) => {
  let inputProps = ({
    placeholder,
    type
  });

  if (defaultValue) inputProps = ({...inputProps, ...{defaultValue: defaultValue.toString()}});
  if (value) inputProps = ({...inputProps, ...{value: value.toString()}});

  return (
    <Form.Group as={Row} className="mb-3" controlId={controlId}>
      <Form.Label column md="3" lg="2">{label}</Form.Label>
      <Col>
        <Form.Control {...inputProps}/>
      </Col>
    </Form.Group>
  );
}

export default Result;