import React from "react";
import useHook from "./hook";
import {Dropdown, DropdownButton} from "react-bootstrap";

export const AddDeviceButton: React.FC = (): React.ReactElement => {
  const {
    onAddZigbeeClockedHandler,
    onAddBleClockedHandler
  } = useHook();

  return (
    <DropdownButton title="Add device" variant="outline-secondary">
      <Dropdown.Item onClick={onAddZigbeeClockedHandler}>Zigbee</Dropdown.Item>
      <Dropdown.Item onClick={onAddBleClockedHandler}>Bluetooth</Dropdown.Item>
    </DropdownButton>
  )
}