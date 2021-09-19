import React from "react";
import {AppDialog} from "../../../shared/app-dialog";

interface IProps {
  show: boolean,
  setShow: (value: boolean) => void,
}

export const AddZigbeeDialog: React.FC<IProps> = ({
  show,
  setShow
}): React.ReactElement => {
  return (
    <AppDialog show={show} title="Add Zigbee device" setShow={setShow}>
      ...
    </AppDialog>
  )
}

export default AddZigbeeDialog;