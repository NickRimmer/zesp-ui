import React, {Fragment, useState} from "react";
import UpdatesNotificationDialog from "./UpdatesNotificationDialog";
import {useDispatch, useSelector} from "react-redux";
import {getZespFirmwareInstalledVersion, getZespFirmwareUpdateInfo, setZespFirmwareUpdate} from "../../store/slices/zespFirmwareSlice";

export const UpdatesNotification: React.FC = (): React.ReactElement => {
  const zespFirmwareUpdate = useSelector(getZespFirmwareUpdateInfo);
  const zespCurrentVersion = useSelector(getZespFirmwareInstalledVersion);
  const [showDialog, setShowDialog] = useState(false);

  if (!zespFirmwareUpdate || zespFirmwareUpdate["ver"] === zespCurrentVersion) return (<Fragment/>);

  const title = `${zespCurrentVersion} to ${zespFirmwareUpdate["ver"]} update`;
  const onUpdatesClickedHandler = () => {
    setShowDialog(true);
  }

  return (
    <div>
      <span onClick={onUpdatesClickedHandler} className="badge bg-info ms-3 notification-updates clickable" title={title}>
        <i className="bi bi-cloud-arrow-down-fill"/>
      </span>
      {showDialog && (<UpdatesNotificationDialog
        onClosed={() => setShowDialog(false)}
        zespFirmwareUpdate={zespFirmwareUpdate}
        zespFirmwareCurrentVersion={zespCurrentVersion}/>)}
    </div>
  )
}

export default UpdatesNotification;