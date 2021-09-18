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
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../../store/configure";
import {DeviceInfo} from "../../models/DeviceInfo";
import {setSpinner, setSpinnerShow} from "../../store/slices/spinnerSlice";

export default () => {
  const {ieee} = useParams<{ ieee: string }>();
  const [show, setShow] = useState(true);
  const [autoExit, setAutoExit] = useState(false);
  const dispatch = useDispatch();
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

  const returnBack = () => history.push("/devices");

  const onCloseClickHandler = () => {
    setAutoExit(true);
    setShow(false)
  };
  const handleExit = () => {
    if (!autoExit) return;
    setTimeout(returnBack, 100)
  };
  const onDebugDeviceHandler = () => {
    console.log(deviceInfo);
    toast.success("Check console for debug info", {icon: "👽"});
  }

  const onDeleteDeviceHandler = () => {
    dispatch(setSpinner({show: true, message: "Deleting..."}));
    setShow(false);

    setTimeout(() => {
      toast.success("Device deleted", {icon: "😵‍💫"});
      dispatch(setSpinnerShow(false));
      returnBack();
    }, 3000);
  }

  const headerHandlers = {
    onCloseClickHandler,
    onEditDeviceHandler: () => console.debug("edit clicked"),
    onDeleteDeviceHandler,
    onDebugDeviceHandler,
  }

  return (
    <Modal show={show} onHide={onCloseClickHandler} onExited={handleExit}>
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
  )
}