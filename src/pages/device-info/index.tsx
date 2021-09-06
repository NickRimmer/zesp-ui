import React, {useState} from "react";
import "./styles.scss";
import {useHistory, useParams} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {Devices} from "../../services/devices";
import {useGlobalState} from "../../shared/global-state-provider";
import CustomHeader from "./header";
import CustomBody from "./body";
import CustomDeviceNotFound from "./not-found";
import toast from "react-hot-toast";

export default () => {
  const {ieee} = useParams<{ ieee: string }>();
  const [show, setShow] = useState(true);
  const history = useHistory();
  const globalState = useGlobalState();

  const deviceInfo = Devices.getDevice(globalState, ieee);
  if (!deviceInfo) return (<CustomDeviceNotFound/>);

  const groups = Devices.getControlGroups(deviceInfo);
  if (!groups || groups.length === 0) {
    console.warn(`No controls found for '${deviceInfo.zespInfo.IEEE}' device`);
    return (<CustomDeviceNotFound/>);
  }

  const [activeGroupName, setActiveGroupName] = useState(groups[0].name);

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);
  const handleDetails = () => {
    console.log(deviceInfo);
    toast.success("Check console for logs", {icon: "👽"});
  }

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit}>
      <CustomHeader
        groups={groups}
        device={deviceInfo}
        activeGroupName={activeGroupName}
        setActiveGroupName={setActiveGroupName}
        onCloseClicked={handleClose}
        onDetailsClicked={handleDetails}
      />

      <CustomBody
        groups={groups}
        device={deviceInfo}
        activeGroupName={activeGroupName}/>
    </Modal>
  )
}