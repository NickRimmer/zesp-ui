import React from "react";
import "./style.scss";
import useHook from "./hook";
import {FadeIn} from "../../shared/fadein-transition";
import {Card, Col, Dropdown} from "react-bootstrap";
import {NavLink, useHistory} from "react-router-dom";
import {CustomSpinner} from "../../shared/loading-spinner";
import ErrorMessage from "../../shared/error-message";
import DeviceTemplateReport from "./device-template-report";

export const DeviceTemplatePage: React.FC = (): React.ReactElement => {
  const {
    template,
    devices,
    status,
    ieee
  } = useHook();

  const history = useHistory();

  if (status === "loading")
    return (<CustomSpinner message="Template loading..."/>)

  if (status === "error" || !template)
    return (<ErrorMessage title="Loading error">Oops, for some reasons we cannot read template data for selected device.</ErrorMessage>)

  return (
    <FadeIn>
      <div>
        <Card className="device-template">
          <Card.Header className="breadcrumb">
            <NavLink to="/devices" className="breadcrumb-item">Devices</NavLink>
            <NavLink to={`/devices/${ieee}`} className="breadcrumb-item">{template.title}</NavLink>
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
              {Object.keys(template.reports).map(key => {
                return (<DeviceTemplateReport key={key} reportKey={key} template={template}/>)
              })}
            </Col>
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  )
}

export default DeviceTemplatePage;