import {DataLayoutItemsGroup} from "../../models/DataControlSettings";
import {Dropdown, Modal, OverlayTrigger, Popover} from "react-bootstrap";
import React, {useState} from "react";
import {DeviceInfo} from "../../models/DeviceInfo";

export default (props: {
  device: DeviceInfo,
  groups: DataLayoutItemsGroup[],
  activeGroupName: string,
  setActiveGroupName: (group: string) => void,
  onCloseClickHandler: () => void,
  onSettingsHandler: () => void,
  onDeleteDeviceHandler: () => void,
  onDebugDeviceHandler: () => void,
  onEditTemplateHandler: () => void,
}) => {
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);
  const title = props.device.zespInfo.Name || props.device.zespInfo.ModelId;

  const buildMultiply = () => (
    <ul className="nav nav-tabs">
      {props.groups.map((group, i) =>
        (
          <li className="nav-item" key={i}>
            <button
              type="button"
              className={`btn btn-light nav-link ${props.activeGroupName === group.name ? "active" : ""}`}
              onClick={() => props.setActiveGroupName(group.name)}>
              {group.name === "main" ? title : group.name}
            </button>
          </li>
        )
      )}
    </ul>
  )

  const buildSingle = () => (<div>{title}</div>);

  const headerClassName = props.groups.length > 1 ? "with-tabs" : "";
  const headerContent = props.groups.length > 1 ? buildMultiply() : buildSingle();

  const onDeleteDeviceHandler = () => {
    if (deleteConfirmed) props.onDeleteDeviceHandler();
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3" className="bg-danger text-light">Achtung! Are you sure?</Popover.Header>
      <Popover.Body>
        To delete device registration, click <span className="text-danger">Unpair device</span> one more time...
      </Popover.Body>
    </Popover>
  );

  return (
    <Modal.Header className={`${headerClassName} with-buttons`}>
      <div>{headerContent}</div>
      <div className="text-end modal-right-buttons">
        <Dropdown className="d-inline-block">
          <Dropdown.Toggle variant="link"><i className="bi bi-three-dots-vertical"/></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={props.onSettingsHandler}>Settings</Dropdown.Item>
            <Dropdown.Item onClick={props.onEditTemplateHandler}>Edit template</Dropdown.Item>
            <OverlayTrigger trigger="click" placement="left" overlay={popover} rootClose={true} onToggle={setDeleteConfirmed}>
              <button className="dropdown-item" onClick={onDeleteDeviceHandler}>Unpair device</button>
            </OverlayTrigger>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={props.onDebugDeviceHandler}>Debug</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <span className="border-end mx-2"/>
        <button type="button" className="btn" aria-label="Close" onClick={props.onCloseClickHandler}><i className="bi bi-x-lg"/></button>
      </div>
    </Modal.Header>
  )
}