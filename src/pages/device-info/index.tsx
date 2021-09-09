import React, {useState} from "react";
import "./styles.scss";
import {useHistory, useParams} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {Devices} from "../../services/devices";
import CustomHeader from "./header";
import CustomBody from "./body";
import CustomDeviceNotFound from "./not-found";
import toast from "react-hot-toast";
import {getDeviceByIee} from "../../store/slices/devicesSlice";
import {useSelector} from "react-redux";
import {RootState} from "../../store/configure";
import {DeviceInfo} from "../../models/DeviceInfo";

export default () => {
  const {ieee} = useParams<{ ieee: string }>();
  const [show, setShow] = useState(true);
  const history = useHistory();
  const deviceInfo = useSelector((state: RootState) => getDeviceByIee(state, ieee), (a: DeviceInfo | undefined, b: DeviceInfo | undefined) => {
    if (!a || !b) return false;
    const keysA = Object.keys(a.zespInfo.Report);
    const keysB = Object.keys(b.zespInfo.Report);

    if (keysA.length != keysB.length) return false;
    for (const key of keysA)
      if (a.zespInfo.Report[key] !== b.zespInfo.Report[key]) return false;

    return true;
  });

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

  console.debug(`Update device info dialog...`);
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
