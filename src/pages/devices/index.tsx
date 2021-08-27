import React from "react";
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

  const rootDevice = globalState.state.devices[0];
  const otherDevices: DeviceInfo[] = globalState.state.devices ?? []; //TODO filter it

  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <div className="group">
              <div className="title h5 pb-3">ZESP Root device</div>
              <div className="items d-flex flex-wrap">
                <Item device={rootDevice}/>
              </div>
            </div>

            {otherDevices.length > 0 && (
              <div className="group border-top pt-4">
                <div className="title h5 pb-3">Other devices <span className="badge bg-secondary">{otherDevices.length}</span></div>
                <div className="items d-flex flex-wrap">
                  {otherDevices.map((device, i) => (<Item device={device} key={i}/>))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>
        {/*<Card>*/}
        {/*  <Card.Header>Root device</Card.Header>*/}
        {/*  <Card.Body>*/}
        {/*    ...*/}
        {/*  </Card.Body>*/}
        {/*</Card>*/}

        {/*<Card>*/}
        {/*  <Card.Header>Light devices</Card.Header>*/}
        {/*  <Card.Body>*/}
        {/*    ...*/}
        {/*  </Card.Body>*/}
        {/*</Card>*/}

        {/*<Card>*/}
        {/*  <Card.Header>Sensors</Card.Header>*/}
        {/*  <Card.Body>*/}
        {/*    ...*/}
        {/*  </Card.Body>*/}
        {/*</Card>*/}
      </div>
    </FadeIn>
  );
}

export default Result; 