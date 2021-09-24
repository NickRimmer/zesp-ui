import React, {useState} from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {DataControlSettings} from "../models/DataControlSettings";
import {DeviceControls} from "../services/deviceControls";
import {DeviceControlCol1, DeviceControlCol2} from "./index";
import {HighlightOnUpdate} from "../shared/transition/HighlightOnUpdate";
import {Row} from "react-bootstrap";

export const UnknownControl = (props: IDeviceControlProps<DataControlSettings>) => {
  const [showDetails, setShowDetails] = useState(false);
  const configData = JSON.stringify(props.config)
  const reportData = JSON.stringify(DeviceControls.getControlReport(props));

  const report = DeviceControls.getControlReport(props);
  if (!report) return (<NoReport id={props.config.id} reportData={reportData} configData={configData}/>)

  const label = report.label || props.config.name || props.config.id || "Unknown data";
  const value =
    (report.parsed && report.parsed.toString().trim() === report.val.toString().trim() && report.parsed)
    || (report.parsed && report.val && `${report.parsed} (${report.val})`)
    || report.val
    || "No data";

  const roleParts = report.role?.split("&");
  const roleSettings = roleParts && roleParts.length > 1 && JSON.parse(roleParts[1]);
  const units = (roleSettings && roleSettings["unit_of_measurement"]) || "";

  const showDetailsClicked = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setShowDetails(!showDetails);
  }

  return (
    <Row>
      <DeviceControlCol1>{label}:</DeviceControlCol1>
      <DeviceControlCol2>
        <HighlightOnUpdate>{value} {units}</HighlightOnUpdate>
        <a onClick={showDetailsClicked} href="#" className="value-info" title="Unrecognized data, click to show details">
          <i className="bi bi-info-circle-fill ms-2 text-secondary"/>
        </a>
      </DeviceControlCol2>
      <div className={`alert alert-info flex-column col-12 ${showDetails ? "" : "d-none"}`}>
        <div>{configData}</div>
        {reportData && (<div className="mt-2">{reportData}</div>)}
      </div>
    </Row>
  )

  // return 
}

const NoReport = (props: { id: string, configData: string, reportData: string }) => (
  <Row>
    <DeviceControlCol1>{props.id}</DeviceControlCol1>
    <DeviceControlCol2>
      <div className="alert alert-info">
        <div>{props.configData}</div>
        {props.reportData && (<div className="mt-2">{props.reportData}</div>)}
      </div>
    </DeviceControlCol2>
  </Row>
)
