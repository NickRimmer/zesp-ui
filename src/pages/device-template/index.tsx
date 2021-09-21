import React from "react";
import useHook from "./hook";
import {FadeIn} from "../../shared/fadein-transition";
import {Card} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {CustomSpinner} from "../../shared/loading-spinner";
import ErrorMessage from "../../shared/error-message";

export const DeviceTemplatePage: React.FC = (): React.ReactElement => {
  const {
    template,
    status,
    ieee
  } = useHook();

  if (status === "loading")
    return (<CustomSpinner message="Template loading..."/>)

  if (status === "error" || !template)
    return (<ErrorMessage title="Loading error">Oops, for some reasons we cannot read template data for selected device.</ErrorMessage>)

  return (
    <FadeIn>
      <div>
        <Card>
          <Card.Header className="breadcrumb">
            <NavLink to="/devices" className="breadcrumb-item">Devices</NavLink>
            <NavLink to={`/devices/${ieee}`} className="breadcrumb-item">{template.title}</NavLink>
            <span className="breadcrumb-item">Template data</span>
          </Card.Header>
          <Card.Body>
            {Object.keys(template.reports).map(key => {
              const report = template.reports[key]
              return (
                <div key={key}>{key}: {report.label}</div>
              )
            })}
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  )
}

export default DeviceTemplatePage;