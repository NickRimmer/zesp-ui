// dialog header, will show one simple title or multiple tabs in case of few groups
import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import {LayoutSettingsGroup} from "../../models/LayoutSettings";
import {Modal} from "react-bootstrap";
import React from "react";

export default (props: {
  device: DeviceInfo,
  groups: LayoutSettingsGroup[],
  activeGroupName: string,
  setActiveGroupName: (group: string) => void
}) => {
  const title = props.device.Name || props.device.ModelId;

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

  return (<Modal.Header className={headerClassName}>{headerContent}</Modal.Header>)
}