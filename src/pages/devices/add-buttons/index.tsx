import React from "react";
import useHook from "./hook";
import {Dropdown, DropdownButton} from "react-bootstrap";
import AddZigbeeDialog from "../add-zigbee-dialog";

export const AddDeviceButton: React.FC = (): React.ReactElement => {
  const {
    onAddZigbeeClockedHandler,
    onAddBleClockedHandler,
    showZigbeeDialog,
    setShowZigbeeDialog
  } = useHook();

  return (
    <>
      <DropdownButton title="Add device" variant="outline-secondary">
        <Dropdown.Item onClick={onAddZigbeeClockedHandler}>Zigbee</Dropdown.Item>
        <Dropdown.Item onClick={onAddBleClockedHandler}>Bluetooth</Dropdown.Item>
      </DropdownButton>
      <AddZigbeeDialog show={showZigbeeDialog} setShow={setShowZigbeeDialog}/>
    </>
  )
}