import React, {Fragment, useContext, useEffect} from "react";
import {Container, Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FadeIn} from "../../shared/fadein-transition";
import {ZespSettings} from "../../services/zesp/models/ZespSettings";
import toast from "react-hot-toast";
import {useDispatch, useSelector} from "react-redux";
import {setSpinnerShow} from "../../store/slices/spinnerSlice"
import {setZespSettings, getZespSettings} from "../../store/slices/settingsSlice"
import useZespSettings from "../../services/zesp/zespSettings.hook";
import {Dispatch} from "@reduxjs/toolkit";
import {ZespContext} from "../../shared/agents/ZespAgent";

const Result = () => {
  const dispatch = useDispatch();
  const zesp = useContext(ZespContext);
  const settings = useSelector(getZespSettings);
  const {getAsync} = useZespSettings(zesp);

  useEffect(() => {
    dispatch(setSpinnerShow(true));

    getAsync()
      .then(data => {
        dispatch(setZespSettings(data));
      })
      .catch(error => {
        //TODO show error window
        alert(error);
      })
      .finally(() => dispatch(setSpinnerShow(false)));
  }, []);

  if (!settings) return (<Fragment/>);

  return (
    <FadeIn>
      <Container className="p-0">
        <Nav variant="pills">
          <Nav.Item><NavLink className="nav-link" to="/setup" exact>Wifi client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/zigbee">Zigbee</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/mqtt">MQTT client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/telegram">Telegram bot</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/z2m">Z2M client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/firmware">Firmware manager</NavLink></Nav.Item>
          {/*<Nav.Item className="ms-auto"><NavLink className="nav-link" to="/setup/zesp-ui"><i className="bi bi-gear-fill"/> ZESP:UI</NavLink></Nav.Item>*/}
        </Nav>
      </Container>
    </FadeIn>
  );
}

export const SaveSettings = (
  data: Partial<ZespSettings>,
  settings: ZespSettings | undefined,
  dispatch: Dispatch,
  setAsync: { (settings: ZespSettings): Promise<void> }) =>
  new Promise<void>((resolve, reject) => {
    if (!settings) reject("Settings not loaded");
    dispatch(setSpinnerShow(true));

    const updatedSettings: ZespSettings = ({...settings, ...data}) as ZespSettings;
    setAsync(updatedSettings)
      .then(() => {
        dispatch(setZespSettings(updatedSettings));
        resolve();
        toast.success("Settings updated");
      })
      .catch(reason => {
        toast.error(`Cannot save: ${reason}`);
        reject(reason);
      })
      .finally(() => dispatch(setSpinnerShow(false)));
  })

export default Result;