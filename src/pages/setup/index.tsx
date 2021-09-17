import React, {Fragment, useEffect} from "react";
import {Container, Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FadeIn} from "../../shared/fadein-transition";
import {ZespSettings} from "../../services/zesp/models/ZespSettings";
import toast from "react-hot-toast";
import {BsGearFill} from "react-icons/bs";
import {useDispatch, useSelector} from "react-redux";
import {setSpinnerShow} from "../../store/slices/spinnerSlice"
import {setZespSettings, getZespSettings} from "../../store/slices/settingsSlice"
import ZespSettingsService from "../../services/zesp/service-settings";
import {Dispatch} from "@reduxjs/toolkit";

const Result = () => {
  const dispatch = useDispatch();
  const settings = useSelector(getZespSettings);

  useEffect(() => {
    dispatch(setSpinnerShow(true));

    ZespSettingsService.getAsync()
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
      <div className="aaa">...</div>
      <Container className="p-0">
        <Nav variant="pills">
          <Nav.Item><NavLink className="nav-link" to="/setup" exact>Wifi client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/zigbee">Zigbee</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/mqtt">MQTT client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/telegram">Telegram bot</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/z2m">Z2M client</NavLink></Nav.Item>
          <Nav.Item className="ms-auto"><NavLink className="nav-link" to="/setup/zesp-ui"><BsGearFill style={{marginTop: "-3px"}}/> ZESP:UI</NavLink></Nav.Item>
        </Nav>
      </Container>
    </FadeIn>
  );
}

export const SaveSettings = (data: Partial<ZespSettings>, settings: ZespSettings | undefined, dispatch: Dispatch) => new Promise<void>((resolve, reject) => {
  if (!settings) reject("Settings not loaded");
  dispatch(setSpinnerShow(true));

  const updatedSettings: ZespSettings = ({...settings, ...data}) as ZespSettings;
  ZespSettingsService
    .setAsync(updatedSettings)
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