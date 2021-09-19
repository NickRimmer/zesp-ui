import React from "react";
import "./styles.scss";
import useHook from "./hook";
import {FadeIn} from "../../shared/fadein-transition";
import {Card, Row} from "react-bootstrap";
import Item from "./item";
import {AddDeviceButton} from "./add-buttons";
import {useTranslation} from "react-i18next";

const Result: React.FC = (): React.ReactElement => {
  const {
    deviceItems
  } = useHook();
  const {t} = useTranslation("pages.devices");

  if (deviceItems.length == 0) return (
    <div>No devices found...</div>
  )

  console.debug("Building list of devices to show...");

  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <div className="group border-top pt-4">
              <div className="title h5 pb-2 d-flex justify-content-between align-items-center">
                <div>
                  <span>{t("groups.all")}</span>
                  {deviceItems.length > 1 && (<span className="badge bg-secondary ms-2">{deviceItems.length}</span>)}
                </div>
                <AddDeviceButton/>
              </div>
              <Row className="items">
                {deviceItems.map(device => (<Item device={device} key={device.ieee}/>))}
              </Row>
            </div>
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  );
}

export default Result;
