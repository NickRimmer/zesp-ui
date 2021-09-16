import React, {Fragment, useState} from "react";
import UpdatesNotificationDialog from "./UpdatesNotificationDialog";
import {useSelector} from "react-redux";
import {getZespFirmwareUpdateInfo} from "../../store/slices/zespFirmwareSlice";

export const UpdatesNotification: React.FC = (): React.ReactElement => {
  const zespFirmwareUpdate = useSelector(getZespFirmwareUpdateInfo);

  if (!zespFirmwareUpdate) return (<Fragment/>);

  const [showDialog, setShowDialog] = useState(false);
  const title = "ZESP Firmware update available: Beta16092021";
  const onUpdatesClickedHandler = () => {
    setShowDialog(true);
  }

  return (
    <div>
      <span onClick={onUpdatesClickedHandler} className="badge bg-info ms-3 notification-updates clickable" title={title}>
        <i className="bi bi-cloud-arrow-down-fill"/>
      </span>
      {showDialog && (<UpdatesNotificationDialog onClosed={() => setShowDialog(false)}/>)}
    </div>
  )
}

export default UpdatesNotification;