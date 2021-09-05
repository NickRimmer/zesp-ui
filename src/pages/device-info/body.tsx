import {DataLayoutItemsGroup} from "../../models/DataControlSettings";
import {Modal} from "react-bootstrap";
import React, {FunctionComponent} from "react";
import {DeviceInfo} from "../../models/DeviceInfo";
import {BinarySensorLayout} from "../../device-controls/layouts/binary-sensor";
import {LayoutProps} from "../../models/LayoutProps";
import {DefaultLayout} from "../../device-controls/layouts/DefaultLayout";

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
  const LayoutTag: FunctionComponent<LayoutProps> = layouts[layoutName] || DefaultLayout;

  return (
    <Modal.Body className="text-start device-dialog p-4">
      <LayoutTag {...layoutProps}/>
    </Modal.Body>
  )
}

const layouts = {
  default: DefaultLayout,
  binarySensorLayout: BinarySensorLayout,
} as { [name: string]: FunctionComponent<LayoutProps> };
