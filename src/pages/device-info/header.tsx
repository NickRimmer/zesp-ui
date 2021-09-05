import {DataLayoutItemsGroup} from "../../models/DataControlSettings";
import {Modal} from "react-bootstrap";
import React from "react";
import {DeviceInfo} from "../../models/DeviceInfo";

export default (props: {
  device: DeviceInfo,
  groups: DataLayoutItemsGroup[],
  activeGroupName: string,
  setActiveGroupName: (group: string) => void,
  onCloseClicked: () => void,
  onDetailsClicked?: () => void,
}) => {
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
    <Modal.Header className={headerClassName}>
      <div>{headerContent}</div>
      <div className="text-end modal-right-buttons">
        {props.onDetailsClicked && (<button type="button" className="btn" onClick={props.onDetailsClicked}><i className="bi bi-three-dots-vertical"/></button>)}
        <span className="border-end ms-2 me-3"/>
        <button type="button" className="btn-close me-1" aria-label="Close" onClick={props.onCloseClicked}/>
      </div>
    </Modal.Header>
  )
}