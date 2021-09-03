import {DataLayoutItemsGroup} from "../../models/DataLayoutItem";
import {Modal} from "react-bootstrap";
import {getControlForDevice} from "../../device-controls";
import React from "react";
import {DeviceInfo} from "../../models/DeviceInfo";

export default (props: {
  device: DeviceInfo,
  groups: DataLayoutItemsGroup[],
  activeGroupName: string
}) => {
  const group = props.groups.find(x => x.name === props.activeGroupName);
  if (!group) return (<div>Group '{props.activeGroupName}' not found.</div>)

  return (
    <Modal.Body className="text-start device-dialog p-4">
      {group.settings.map((control, i) =>
        (<div key={i} className="device-control-group">{getControlForDevice(control, props.device)}</div>))}
    </Modal.Body>
  )
}