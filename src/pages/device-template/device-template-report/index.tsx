import React, {Fragment, useState} from "react";
import useHook from "./hook";
import {Dropdown, OverlayTrigger, Popover} from "react-bootstrap";
import {ZespReportInfo} from "../../../services/zesp/models/ZespReportInfo";
import {ReportKeyInfo} from "../../../models/ReportKeyInfo";
import {ZespDeviceInfo} from "../../../services/zesp/models/ZespDeviceInfo";

export interface IDeviceTemplateReportProps {
  template: ZespDeviceInfo,
  reportKey: string,

  showSettingsHandler: (data: { keyInfo: ReportKeyInfo, reportInfo: ZespReportInfo }) => void,
}

export const DeviceTemplateReport: React.FC<IDeviceTemplateReportProps> = (props): React.ReactElement => {
  const hook = useHook(props);
  if (!hook) {
    console.warn(`Unknown report with key ${props.reportKey}`)
    return (<Fragment/>)
  }

  const {
    report,
    keyInfo,
    clusterInfo,
    attributeInfo,

    runHandler,
    editHandler,
    deleteHandler
  } = hook;

  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const deleteConfirmedHandler = () => {
    if (deleteConfirmed) deleteHandler();
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-danger text-light">Achtung! Are you sure?</Popover.Header>
      <Popover.Body>
        Please, click one more time in menu <span className="text-danger">Delete report</span> to confirm.
      </Popover.Body>
    </Popover>
  );

  return (
    <div className="report">
      <div className="report-menu">
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle variant="link"><i className="bi bi-three-dots-vertical" style={{fontSize: "25px"}}/></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={editHandler}>Edit settings</Dropdown.Item>
            <OverlayTrigger trigger="click" overlay={popover} rootClose={true} onToggle={setDeleteConfirmed}>
              <button className="dropdown-item" onClick={deleteConfirmedHandler}>Delete report</button>
            </OverlayTrigger>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={runHandler}>Run to read</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <div className="report-key">
        <div className="title">{clusterInfo.name}</div>
        <div className="code">{keyInfo.clusterId}</div>
      </div>

      <div className="report-key">
        <div className="title">{attributeInfo?.name || attributeInfo?.id || "Unknown"}</div>
        <div className="code">{keyInfo.attributeId || "-"}</div>
      </div>

      <div className="report-label">{report.label}</div>
      <div className="report-action">
        <i className="bi bi-play-fill" style={{fontSize: "45px"}} onClick={runHandler}/>
      </div>
    </div>
  )
}

export default DeviceTemplateReport;