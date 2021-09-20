import React, {useState} from "react";
import "./styles.scss";
import useHook from "./hook";
import {Modal} from "react-bootstrap";
import CustomHeader from "./header";
import CustomBody from "./body";
import CustomDeviceNotFound from "./not-found";
import DeviceSettingsDialog from "../../shared/device-settings-dialog";

export default () => {

  const {
    deviceInfo,
    groups,
    showDialog,
    showSettings,

    onDebugDeviceHandler,
    onDeleteDeviceHandler,
    onExitHandler,
    onCloseClickHandler,
    onSettingsHandler,
    onSettingsClosedHandler,
    onReportsHandler,
  } = useHook()

  if (!groups || groups.length === 0) {
    console.warn(`No controls found for '${deviceInfo.zespInfo.IEEE}' device`);
    return (<CustomDeviceNotFound/>);
  }

  const [activeGroupName, setActiveGroupName] = useState(groups[0].name);

  const headerHandlers = {
    onCloseClickHandler,
    onSettingsHandler,
    onSettingsClosedHandler,
    onDeleteDeviceHandler,
    onDebugDeviceHandler,
    onReportsHandler
  }

  return (
    <>
      <Modal show={showDialog} onHide={onCloseClickHandler} onExited={onExitHandler}>
        <CustomHeader
          groups={groups}
          device={deviceInfo}
          activeGroupName={activeGroupName}
          setActiveGroupName={setActiveGroupName}
          {...headerHandlers}
        />

        <CustomBody
          groups={groups}
          device={deviceInfo}
          activeGroupName={activeGroupName}/>
      </Modal>
      {showSettings && (<DeviceSettingsDialog onClosed={onSettingsClosedHandler} device={deviceInfo}/>)}
    </>
  )
}
