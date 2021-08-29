import React, {Fragment} from "react";
import "./styles.scss";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";
import Item from "./item";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import {useTranslation} from "react-i18next";
import {GroupName} from "../../models/DeviceDetails"

const Result = () => {
  const globalState = useGlobalState();
  const {t} = useTranslation("pages.devices");

  //TODO style and translate it
  if (!globalState.state.devices || globalState.state.devices.length == 0) return (
    <div>No devices found...</div>
  )

  const devices = globalState.state.devices.sort();

  //TODO filter can be different, according to settings in future 
  const filterByGroup = showWithoutGroups;
  // const filterByGroup = showDeviceInFirstGroups;
  // const filterByGroup = showDeviceInAllGroups;

  const rootDevices: DeviceInfo[] = devices.filter(x => filterByGroup(x, "root"));
  const lightDevices: DeviceInfo[] = devices.filter(x => filterByGroup(x, "light"));
  const sensorDevices: DeviceInfo[] = devices.filter(x => filterByGroup(x, "sensor"));
  const switchDevices: DeviceInfo[] = devices.filter(x => filterByGroup(x, "switch"));
  const otherDevices: DeviceInfo[] = devices.filter(x =>
    !rootDevices.includes(x) &&
    !lightDevices.includes(x) &&
    !sensorDevices.includes(x) &&
    !switchDevices.includes(x)
  );

  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <DevicesGroup title={t("groups.hub")} devices={rootDevices}/>
            <DevicesGroup title={t("groups.lights")} devices={lightDevices}/>
            <DevicesGroup title={t("groups.sensors")} devices={sensorDevices}/>
            <DevicesGroup title={t("groups.switches")} devices={switchDevices}/>
            <DevicesGroup title={otherDevices.length === devices.length ? t("groups.all") : t("groups.other")} devices={otherDevices}/>
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

const showWithoutGroups = (device: DeviceInfo, groupName: GroupName) => !groupName;

// const showDeviceInAllGroups = (device: DeviceInfo, groupName: TemplateGroupName) =>
//   device.templateInfo &&
//   device.templateInfo.groups &&
//   device.templateInfo.groups.indexOf(groupName) >= 0;

// const showDeviceInFirstGroups = (device: DeviceInfo, groupName: TemplateGroupName) =>
//   device.templateInfo &&
//   device.templateInfo.groups &&
//   device.templateInfo.groups.length > 0 &&
//   device.templateInfo.groups[0] === groupName;

export default Result; 