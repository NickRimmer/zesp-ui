import React, {useContext, useState} from "react";
import {AppDialog} from "../app-dialog";
import {Button} from "react-bootstrap";
import {useDispatch} from "react-redux";
import {setSpinner} from "../../store/slices/spinnerSlice";
import {ZespContext} from "../agents/ZespAgent";

export const PowerDialogLink: React.FC = (): React.ReactElement => {
  const [show, setShow] = useState(false);
  const {zespSend} = useContext(ZespContext);
  const dispatch = useDispatch();

  const showPowerDialogClickHandler = () => setShow(true);

  const onRestartClickedHandler = () => {
    dispatch(setSpinner({show: true, message: "Restarting, please wait..."}));
    setShow(false);
    zespSend({data: "RebootESP"});
  };

  const onShutdownClickedHandler = () => {
    dispatch(setSpinner({show: true, message: "Shutting down..."}));
    // dispatch(setConnectionStatus("reconnect"));
    setShow(false);
    setTimeout(() => document.location.href = "/", 2000);
    zespSend({data: "Shutdown"});
  };

  const navLink = (<span className="nav-link clickable" onClick={showPowerDialogClickHandler}><i className="bi bi-power"/></span>)
  const buttons = (
    <>
      <Button onClick={onRestartClickedHandler}>Restart ZESP</Button>
      <Button onClick={onShutdownClickedHandler} variant="secondary">Shutdown</Button>
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