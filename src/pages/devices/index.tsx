import React from "react";
import "./styles.scss";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";

const Result = () => (
  <FadeIn>
    <div className="devices">
      <Card>
        <Card.Body>
          <div className="group">
            <div className="title h5 border-bottom pb-2">ZESP Root device</div>
            <div className="items d-flex flex-wrap">
              <div className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">0000</div>
                  <div className="ps-2">
                    <div className="title">ZESP_Root</div>
                    <div className="ieee text-muted small">00158D00031E5A56</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="title h5 border-bottom pb-2">Light devices <span className="badge bg-secondary">3</span></div>
            <div className="items d-flex flex-wrap">
              <a href="/devices/00158D00052CD7C4-956A" className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">956A</div>
                  <div className="ps-2">
                    <div className="title">lumi.light.aqcn02</div>
                    <div className="ieee text-muted small">00158D00052CD7C4</div>
                  </div>
                </div>
              </a>
              <a href="#" className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">956A</div>
                  <div className="ps-2">
                    <div className="title">lumi.light.aqcn02.long.name</div>
                    <div className="ieee text-muted small">00158D00052CD7C4</div>
                  </div>
                </div>
              </a>
              <div className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">956A</div>
                  <div className="ps-2">
                    <div className="title">lumi.light.aqcn02</div>
                    <div className="ieee text-muted small">00158D00052CD7C4</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="group">
            <div className="title h5 border-bottom pb-2">Sensors <span className="badge bg-secondary">2</span></div>
            <div className="items d-flex flex-wrap">
              <div className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">FC9C</div>
                  <div className="ps-2">
                    <div className="title">lumi.sensor_magnet</div>
                    <div className="ieee text-muted small">00158D00031C5F15</div>
                  </div>
                </div>
              </div>
              <div className="item p-3">
                <div className="d-flex">
                  <div className="badge bg-info d-flex align-items-center">3540</div>
                  <div className="ps-2">
                    <div className="title">lumi.sensor_motion</div>
                    <div className="ieee text-muted small">00158D0002FD2693</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

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

export default Result; 