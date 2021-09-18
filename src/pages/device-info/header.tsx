import {DataLayoutItemsGroup} from "../../models/DataControlSettings";
import {Dropdown, Modal} from "react-bootstrap";
import React from "react";
import {DeviceInfo} from "../../models/DeviceInfo";

export default (props: {
  device: DeviceInfo,
  groups: DataLayoutItemsGroup[],
  activeGroupName: string,
  setActiveGroupName: (group: string) => void,
  onCloseClickHandler: () => void,
  onEditDeviceHandler: () => void,
  onDeleteDeviceHandler: () => void,
  onDebugDeviceHandler: () => void,
}) => {
  // const [showDropdown, setShowDropdown] = useState(false);
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

  return (
    <Modal.Header className={`${headerClassName} with-buttons`}>
      <div>{headerContent}</div>
      <div className="text-end modal-right-buttons">
        <Dropdown className="d-inline-block">
          {/*<button type="button" className="btn" onClick={() => setShowDropdown(!showDropdown)}><i className="bi bi-three-dots-vertical"/></button>*/}
          <Dropdown.Toggle variant="link"><i className="bi bi-three-dots-vertical"/></Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item onClick={props.onEditDeviceHandler}>Edit device</Dropdown.Item>
            <Dropdown.Item onClick={props.onDeleteDeviceHandler}>Delete</Dropdown.Item>
            <Dropdown.Divider/>
            <Dropdown.Item onClick={props.onDebugDeviceHandler}>Debug</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        {/*<button type="button" className="btn"><i className="bi bi-three-dots-vertical"/></button>*/}
        <span className="border-end mx-2"/>
        <button type="button" className="btn" aria-label="Close" onClick={props.onCloseClickHandler}><i className="bi bi-x-lg"/></button>
      </div>
    </Modal.Header>
  )
}