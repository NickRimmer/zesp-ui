import React, {Fragment} from "react";
import "./styles.scss";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";
import Item from "./item";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";

const Result = () => {
  const globalState = useGlobalState();

  //TODO style and translate it
  if (!globalState.state.devices || globalState.state.devices.length == 0) return (
    <div>No devices found...</div>
  )

  let devices = globalState.state.devices;

  // find root device
  const rootDeviceIndex = devices.findIndex(x => x.Device === "0000");
  const rootDevice = devices[rootDeviceIndex];
  devices = devices.filter(x => x != rootDevice);

  const lightDevices: DeviceInfo[] = devices.filter(x => x.templateInfo?.group === "light");
  const sensorDevices: DeviceInfo[] = devices.filter(x => x.templateInfo?.group === "sensor");
  const switchDevices: DeviceInfo[] = devices.filter(x => x.templateInfo?.group === "switch");
  const otherDevices: DeviceInfo[] = devices.filter(x =>
    !lightDevices.includes(x) &&
    !sensorDevices.includes(x) &&
    !switchDevices.includes(x)
  );

  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <div className="group">
              <div className="title h5 pb-3">Hub devices</div>
              <div className="items d-flex flex-wrap">
                <Item device={rootDevice}/>
              </div>
            </div>

            <DevicesGroup title="Light devices" devices={lightDevices}/>
            <DevicesGroup title="Sensors or monitoring systems" devices={sensorDevices}/>
            <DevicesGroup title="Switches" devices={switchDevices}/>
            <DevicesGroup title="Other or unknown devices" devices={otherDevices}/>
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  );
}

const DevicesGroup = (props: { devices: DeviceInfo[], title: string }) => props.devices.length == 0
  ? (<Fragment/>)
  : (
    <div className="group border-top pt-4">
      <div className="title h5 pb-3">{props.title} <span className="badge bg-secondary">{props.devices.length}</span></div>
      <div className="items d-flex flex-wrap">
        {props.devices.map((device, i) => (<Item device={device} key={i}/>))}
      </div>
    </div>
  )

export default Result; 