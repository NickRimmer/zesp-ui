import {DataLayoutItemsGroup} from "../../models/DataControlSettings";
import {Modal} from "react-bootstrap";
import React, {FunctionComponent} from "react";
import {DeviceInfo} from "../../models/DeviceInfo";
import {LayoutProps} from "../../models/LayoutProps";
import {DefaultLayout} from "../../device-controls/layouts/DefaultLayout";
import {layoutsAvailable} from "../../device-controls/layouts";

export default (props: {
  device: DeviceInfo,
  groups: DataLayoutItemsGroup[],
  activeGroupName: string
}) => {
  const group = props.groups.find(x => x.name === props.activeGroupName);
  if (!group) return (<div>Group '{props.activeGroupName}' not found.</div>)

  const layoutProps: LayoutProps = {
    device: props.device,
    settings: group.settings
  };

  const layoutName = props.device.settings?.layout || "default";
  const LayoutElements: FunctionComponent<LayoutProps> = layoutsAvailable[layoutName] || DefaultLayout;

  return (
    <Modal.Body className="text-start device-dialog p-4">
      <LayoutElements {...layoutProps}/>
    </Modal.Body>
  )
}