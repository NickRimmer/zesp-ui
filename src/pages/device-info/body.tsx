import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import {LayoutSettingsGroup} from "../../models/LayoutSettings";
import {Modal} from "react-bootstrap";
import {getControlForDevice} from "../../device-controls";
import React from "react";

export default (props: {
  device: DeviceInfo,
  groups: LayoutSettingsGroup[],
  activeGroupName: string
}) => {
  const group = props.groups.find(x => x.name === props.activeGroupName);
  if (!group) return (<div>Group '{props.activeGroupName}' not found.</div>)

  return (
    <Modal.Body className="text-start device-dialog">
      {group.settings.map((control, i) =>
        (<div key={i} className="device-control-group">{getControlForDevice(control, props.device)}</div>))}
    </Modal.Body>
  )
}