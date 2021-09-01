import React, {Fragment} from "react";
import "./styles.scss";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";
import Item from "./item";
import {useGlobalState} from "../../shared/global-state-provider";
import {useTranslation} from "react-i18next";
import {DeviceInfo} from "../../models/DeviceInfo";

const Result = () => {
  const globalState = useGlobalState();
  const {t} = useTranslation("pages.devices");

  //TODO style and translate it
  if (!globalState.state.devices || globalState.state.devices.length == 0) return (
    <div>No devices found...</div>
  )

  const devices = globalState.state.devices.sort();
  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <DevicesGroup title={t("groups.all")} devices={devices}/>
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  );
}

const DevicesGroup = (props: { devices: DeviceInfo[], title?: string | null }) => props.devices.length == 0
  ? (<Fragment/>)
  : (
    <div className="group border-top pt-4">
      {props.title && (
        <div className="title h5 pb-3">
          <span>{props.title}</span>
          {props.devices.length > 1 && (<span className="badge bg-secondary ms-2">{props.devices.length}</span>)}
        </div>
      )}
      <div className="items d-flex flex-wrap">
        {props.devices.map((device, i) => (<Item device={device} key={i}/>))}
      </div>
    </div>
  )

export default Result; 