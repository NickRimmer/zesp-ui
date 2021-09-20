import React from "react";
import {Col, Row} from "react-bootstrap";

interface IProps {
  title: string,
}

export const ErrorMessage: React.FC<IProps> = ({title, children}): React.ReactElement => {
  return (
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">{title}</h5>
        </div>
        <div className="modal-body">
          <Row>
            <Col xs={3} className="d-flex align-items-center justify-content-center">
              <i className="bi bi-exclamation-diamond text-danger" style={{fontSize: "60px"}}/>
            </Col>
            <Col className="d-flex align-items-center">{children}</Col>
          </Row>
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage;