import React, {Fragment} from "react";
import {useTranslation} from "react-i18next";
import {Button, Card, Col, Row} from "react-bootstrap";
import {CheckGroupInline, InputGroupHorizontal} from "../../shared/form";
import {ReactForm} from "../../shared/form/react-form";
import {FadeIn} from "../../shared/fadein-transition";
import {ZespMqttSettings} from "../../services/zesp/models/ZespSettings";
import {SaveSettings} from "./index";

const Result = () => {
  const {t} = useTranslation(["pages.setup-mqtt", "common"]);
  const settings = {} as ZespMqttSettings;// globalState.state.zespSettings?.MQTT;

  if (!settings || true) return (<Fragment/>);

  const onSubmit = (data: ZespMqttSettings) => SaveSettings({MQTT: data}, t);

  return (
    <FadeIn>
      <Card>
        <ReactForm onSubmit={onSubmit}>
          <Card.Body>
            <InputGroupHorizontal controlId="mqttup" defaultValue={settings.mqttup} label={t("topic.label")} placeholder={t("topic.placeholder")}/>
            <InputGroupHorizontal controlId="mqtt" defaultValue={settings.mqtt} label={t("server.label")} placeholder={t("server.placeholder")}/>
            <InputGroupHorizontal controlId="mqttPort" defaultValue={(settings.mqttPort)?.toString()} label={t("port.label")} placeholder={t("port.placeholder")}/>
            <InputGroupHorizontal controlId="mqttLogin" defaultValue={settings.mqttLogin} label={t("login.label")} placeholder={t("login.placeholder")}/>
            <InputGroupHorizontal type="password" controlId="mqttPassw" defaultValue={settings.mqttPassw} label={t("password.label")} placeholder={t("password.placeholder")}/>
            <Row>
              <Col md="3" lg="2"/>
              <Col className="space-between-4">
                <CheckGroupInline controlId="mqttEnable" defaultChecked={settings.mqttEnable} label={t("is_enabled.label")} checkedValue={1} uncheckedValue={0}/>
                <CheckGroupInline controlId="Home_Assistant" defaultChecked={settings.Home_Assistant} label={t("is_ha_enabled.label")} checkedValue={1} uncheckedValue={0}/>
              </Col>
            </Row>

          </Card.Body>
          <Card.Footer><Button variant="primary" type="submit">{t("common:save_button")}</Button></Card.Footer>
        </ReactForm>
      </Card>
    </FadeIn>
  );
}

export default Result;