import React, {FormEvent, useEffect, useState} from "react";
import {Form, Modal} from "react-bootstrap";

interface IProps {
  title: string,
  className?: string,
  size?: 'sm' | 'lg' | 'xl',
  footer?: React.ReactElement | undefined,
  forceClose?: boolean,
  onShow?: () => void,
  onHide?: () => void,
  onClosed?: () => void,
  onSubmit?: () => void,
}

export const AppDialog: React.FunctionComponent<IProps> = ({
  children,
  title,
  size,
  className,

  footer,
  forceClose,
  onShow,
  onHide,
  onClosed,
  onSubmit,
}): React.ReactElement => {
  const [show, setShow] = useState(true);
  useEffect(() => {
    if (forceClose) setShow(false);
  }, [forceClose]);

  const onClosedHandler = () => {
    if (onClosed) onClosed();
  }

  const onHideHandler = () => {
    setShow(false)
    if (onHide) onHide();
  }

  const onSubmitHandler = (event: FormEvent) => {
    event.preventDefault();

    if (onSubmit) onSubmit();
  }

  const result = (
    <>
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
    </>
  )

  return (
    <Modal show={show} onExited={onClosedHandler} onHide={onHideHandler} onShow={onShow} className={className} size={size}>
      {onSubmit && (<Form onSubmit={onSubmitHandler}>{result}</Form>)}
      {!onSubmit && result}
    </Modal>
  )
}