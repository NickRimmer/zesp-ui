import React, {FormEvent} from "react";
import {Form} from "react-bootstrap";

import {IProps} from "./interfaces";
import $ from "./logic";

const ReactForm = (props: IProps) => {
  const {onSubmit, ...restProps} = props;
  const onSubmitForm = (event: FormEvent) => $.handleSubmit(event, onSubmit);

  return (
    <Form onSubmit={onSubmitForm} {...restProps}>
      {props.children}
    </Form>
  );
}

export {ReactForm};