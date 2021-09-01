import React, {useState} from "react";
import "./styles.scss";
import {useHistory, useParams} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {Devices} from "../../services/devices";
import {useGlobalState} from "../../shared/global-state-provider";
import CustomHeader from "./header";
import CustomBody from "./body";
import CustomDeviceNotFound from "./not-found";

//TODO localize
export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();
  const [show, setShow] = useState(true);
  const history = useHistory();
  const globalState = useGlobalState();
  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);

  const deviceInfo = Devices.getDevice(globalState, ieee, device);
  if (!deviceInfo) return (<CustomDeviceNotFound/>);

  const groups = Devices.getControlGroups(deviceInfo);
  const [activeGroupName, setActiveGroupName] = useState(groups[0].name);

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit} size="lg">
      <CustomHeader groups={groups} device={deviceInfo} activeGroupName={activeGroupName} setActiveGroupName={setActiveGroupName}/>
      <CustomBody groups={groups} device={deviceInfo} activeGroupName={activeGroupName}/>
    </Modal>
  )
}