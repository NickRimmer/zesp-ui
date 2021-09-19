import React, {useState} from "react";
import {Modal} from "react-bootstrap";

interface IProps {
  title: string,
  className?: string,
  footer?: React.ReactElement | undefined,
  onShow?: () => void,
  onHide?: () => void,
  onClosed?: () => void,
}

export const AppDialog: React.FunctionComponent<IProps> = ({
  children,
  title,
  className,
  footer,
  onShow,
  onHide,
  onClosed,
}): React.ReactElement => {
  const [show, setShow] = useState(true);
  const onClosedHandler = () => {
    if (onClosed) onClosed();
  }
  const onHideHandler = () => {
    setShow(false)
    if (onHide) onHide();
  };

  return (
    <Modal show={show} onExited={onClosedHandler} onHide={onHideHandler} onShow={onShow} className={className}>
      <Modal.Header>
        <div>{title}</div>
        <div className="text-end modal-right-buttons">
          <button type="button" className="btn-close me-1" aria-label="Close" onClick={onHideHandler}/>
        </div>
      </Modal.Header>
      <Modal.Body className="text-start">
        {children}
      </Modal.Body>

      {footer && (
        <Modal.Footer>
          {footer}
        </Modal.Footer>
      )}
    </Modal>
  )
}