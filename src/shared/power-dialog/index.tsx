import React, {useState} from "react";
import {AppDialog} from "../app-dialog";
import {Button} from "react-bootstrap";

export const PowerDialogLink: React.FC = (): React.ReactElement => {
  const [show, setShow] = useState(false);
  const showPowerDialogClickHandler = () => {
    setShow(true);
  }

  const navLink = (<span className="nav-link clickable" onClick={showPowerDialogClickHandler}><i className="bi bi-power"/></span>)
  const buttons = (
    <>
      <Button>Restart ZESP</Button>
      <Button variant="secondary">Shutdown</Button>
    </>
  );

  return (
    <>
      {navLink}
      <AppDialog title="Power management" show={show} setShow={setShow} footer={buttons}>
        <div className="mb-3">Restart of ZESP service can take a few minutes. This page will be reloaded automatically when restart completed.</div>
        <div>To shutdown, just click Shutdown button. But this is way with one direction, make sure you know what are you doing.</div>
      </AppDialog>
    </>
  )
}

export default PowerDialogLink;