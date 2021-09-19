import React from "react";
import useHook from "./hook";
import {Dropdown, DropdownButton} from "react-bootstrap";
import AddZigbeeDialog from "../add-zigbee-dialog";

export const AddDeviceButton: React.FC = (): React.ReactElement => {
  const {
    onAddZigbeeClickedHandler,
    onAddBleClickedHandler,
    showDialog,
    setShowDialog,
  } = useHook();

  return (
    <>
      <DropdownButton title="Add device" variant="outline-secondary">
        <Dropdown.Item onClick={onAddZigbeeClickedHandler}>Zigbee</Dropdown.Item>
        <Dropdown.Item onClick={onAddBleClickedHandler}>Bluetooth</Dropdown.Item>
      </DropdownButton>
      {showDialog && (<AddZigbeeDialog onClosed={() => setShowDialog(false)}/>)}
    </>
  )
}