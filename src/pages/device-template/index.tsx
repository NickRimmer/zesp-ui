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
import DeviceTemplateEditor from "./device-template-editor";

export const DeviceTemplatePage: React.FC = (): React.ReactElement => {
  const {
    template,
    devices,
    status,
    ieee,
    showSettings,
    play,

    setShowSettings,
    onSaveReportSettings,
    playHandler,
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
              <NavLink to={`/devices/${ieee}`} className="breadcrumb-item">Settings</NavLink>
              <Dropdown className="d-inline-block">
                <Dropdown.Toggle variant="link" as={"span"} className="breadcrumb-item">{template.Name || template.ModelId}</Dropdown.Toggle>
                <Dropdown.Menu>
                  {devices.map((device, i) => (
                    <Dropdown.Item onClick={() => history.push(`/device/template/${device.ieee}`)} key={i}
                                   className={device.ieee === ieee ? "text-primary" : ""}>{device.name}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </Card.Header>
            <Card.Body className="row">
              <Col xs={12} lg={6}>
                {Object.keys(template.Report).map(key => {
                  return (<DeviceTemplateReport key={key} reportKey={key} template={template} showSettingsHandler={setShowSettings} playHandler={playHandler}/>)
                })}
              </Col>
              <Col xs={12} lg={6}><DeviceTemplateEditor play={play}/></Col>
            </Card.Body>
          </Card>
        </div>
      </FadeIn>
      {showSettings && <DeviceReportSettings onClosed={() => setShowSettings(undefined)} data={showSettings} onSave={onSaveReportSettings}/>}
    </>
  )
}

export default DeviceTemplatePage;
