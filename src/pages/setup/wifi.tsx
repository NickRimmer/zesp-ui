import React, {Fragment} from "react";
import {Button, Card} from "react-bootstrap";
import {FadeIn} from "../../shared/fadein-transition";
import {useTranslation} from "react-i18next";
import {ReactForm} from "../../shared/form/react-form";
import {InputGroupHorizontal} from "../../shared/form";
import {ZespWifiSettings} from "../../services/zesp/models/ZespSettings";
import {SaveSettings} from "./index";
import {useDispatch, useSelector} from "react-redux";
import {getZespSettings} from "../../store/slices/settingsSlice";

const Result = () => {
  const dispatch = useDispatch();
  const allSettings = useSelector(getZespSettings);
  const {t} = useTranslation(["pages.setup-wifi", "common"]);

  if (!allSettings) return (<div>No settings found...</div>);
  const settings = allSettings.Wifi;

  const onSubmit = (data: ZespWifiSettings): Promise<void> => SaveSettings({Wifi: data}, allSettings, dispatch);

  return (
    <Fragment>
      <FadeIn>
        <ReactForm onSubmit={onSubmit}>
          <Card>
            <Card.Body>
              <InputGroupHorizontal controlId="ssid" defaultValue={settings?.ssid} label={t("ssid.label")} placeholder={t("ssid.placeholder")}/>
              <InputGroupHorizontal type="password" controlId="pass" defaultValue={settings?.pass} label={t("pass.label")} placeholder={t("pass.placeholder")}/>
              <InputGroupHorizontal controlId="ip" defaultValue={settings?.ip} label={t("ip.label")} placeholder={t("ip.placeholder")}/>
              <InputGroupHorizontal controlId="mask" defaultValue={settings?.mask} label={t("mask.label")} placeholder={t("mask.placeholder")}/>
              <InputGroupHorizontal controlId="gw" defaultValue={settings?.gw} label={t("gw.label")} placeholder={t("gw.placeholder")}/>
            </Card.Body>
            <Card.Footer><Button variant="primary" type="submit">{t("common:save_button")}</Button></Card.Footer>
          </Card>
        </ReactForm>
      </FadeIn>
    </Fragment>
  )
};

export default Result;