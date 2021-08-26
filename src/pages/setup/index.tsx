import React, {Fragment, useEffect} from "react";
import {Container, Nav} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {ZespService} from "../../services/zesp";
import {Single} from "../../services/single";
import {useGlobalState} from "../../shared/global-state-provider";
import {FadeIn} from "../../shared/fadein-transition";
import {ZespSettings} from "../../services/zesp/models/ZespSettings";
import toast from "react-hot-toast";
import {TFunction} from "react-i18next";
import {IGlobalState} from "../../global-state";
import {BsGearFill} from "react-icons/bs";

const Result = () => {
  const globalState = useGlobalState();

  useEffect(() => {
    Single.Spinner.show();
    ZespService.settings.getAsync()
      .then(data => {
        globalState.setState(prev => ({...prev, ...{zespSettings: data}}))
        Single.Spinner.hide();
      })
      .catch(error => {
        //TODO show error window
        alert(error);
      });
  }, []);

  if (!globalState.state.zespSettings) return (<Fragment/>);

  return (
    <FadeIn>
      <div className="aaa">...</div>
      <Container className="p-0">
        <Nav variant="pills">
          <Nav.Item><NavLink className="nav-link" to="/setup" exact>Wifi client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/zigbee">Zigbee settings</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/mqtt">MQTT client</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/telegram">Telegram bot</NavLink></Nav.Item>
          <Nav.Item><NavLink className="nav-link" to="/setup/z2m">Zigbee2MQTT client</NavLink></Nav.Item>
          <Nav.Item className="ms-auto"><NavLink className="nav-link" to="/setup/zesp-ui"><BsGearFill style={{marginTop: "-3px"}}/> ZESP:UI</NavLink></Nav.Item>
        </Nav>
      </Container>
    </FadeIn>
  );
}

export const SaveSettings = (data: Partial<ZespSettings>, globalState: IGlobalState, t: TFunction<string[]>): Promise<void> => {
  const updatedSettings: ZespSettings = ({...globalState.state.zespSettings!, ...data});
  const promise = ZespService.settings.setAsync(updatedSettings)
    .then(() => globalState.setState(prev => ({...prev, zespSettings: updatedSettings})));

  toast.promise(promise, {loading: t("common:saving_progress"), success: t("common:saving_success"), error: t("common:saving_error")});
  return promise;
}

export default Result;
