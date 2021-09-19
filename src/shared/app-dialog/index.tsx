import React, {Fragment, useEffect, useState} from "react";
import {Modal} from "react-bootstrap";

interface IProps {
  show: boolean,
  title: string,
  setShow: (show: boolean) => void,
  footer?: React.ReactElement | undefined,
}

export const AppDialog: React.FunctionComponent<IProps> = ({
  children,
  show,
  title,
  setShow,
  footer,
}): React.ReactElement => {
  const [dialogLoaded, setDialogLoaded] = useState(show);

  useEffect(() => {
    if (show) setDialogLoaded(true);
  }, [show]);

  const onClosedHandler = () => setDialogLoaded(false);
  const onHideHandler = () => setShow(false);

  if (!dialogLoaded) return (<Fragment/>);
  return (
    <Modal show={show} onExited={onClosedHandler} onHide={onHideHandler}>
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