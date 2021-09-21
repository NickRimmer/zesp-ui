import React from "react";
import "./style.scss";
import useHook from "./hook";
import {FadeIn} from "../../shared/fadein-transition";
import {Card, Col, Dropdown} from "react-bootstrap";
import {NavLink, useHistory} from "react-router-dom";
import {CustomSpinner} from "../../shared/loading-spinner";
import ErrorMessage from "../../shared/error-message";
import DeviceTemplateReport from "./device-template-report";
import DeviceReportSettings from "./device-report-settings";

export const DeviceTemplatePage: React.FC = (): React.ReactElement => {
  const {
    template,
    devices,
    status,
    ieee,
    showSettings,

    setShowSettings,
    onSaveReportSettings
  } = useHook();

  const history = useHistory();

  if (status === "loading")
    return (<CustomSpinner message="Template loading..."/>)

  if (status === "error" || !template)
    return (<ErrorMessage title="Loading error">Oops, for some reasons we cannot read template data for selected device.</ErrorMessage>)

  return (
    <>
      <FadeIn>
        <div>
          <Card className="device-template">
            <Card.Header className="breadcrumb">
              <NavLink to="/devices" className="breadcrumb-item">Devices</NavLink>
              <NavLink to={`/devices/${ieee}`} className="breadcrumb-item">{template.Name || template.ModelId}</NavLink>
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle variant="link" as={"span"} className="breadcrumb-item">Template data</Dropdown.Toggle>
                <Dropdown.Menu>
                  {devices.map((device, i) => (
                    <Dropdown.Item onClick={() => history.push(`/device/template/${device.ieee}`)} key={i}
                                   className={device.ieee === ieee ? "text-primary" : ""}>{device.name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body>
              <Col xs={6}>
                {Object.keys(template.Report).map(key => {
                  return (<DeviceTemplateReport key={key} reportKey={key} template={template} showSettingsHandler={setShowSettings}/>)
                })}
              </Col>
            </Card.Body>
          </Card>
        </div>
      </FadeIn>
      {showSettings && <DeviceReportSettings onClosed={() => setShowSettings(undefined)} data={showSettings} onSave={onSaveReportSettings}/>}
    </>
  )
}

export default DeviceTemplatePage;
