import {useHistory, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import {RootState} from "../../store/configure";
import {getDeviceByIee} from "../../store/slices/devicesSlice";
import {DeviceInfo} from "../../models/DeviceInfo";
import {Devices} from "../../services/devices";
import toast from "react-hot-toast";
import {TypedZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";
import {useContext, useState} from "react";
import {ZespContext} from "../../shared/agents/ZespAgent";

export default () => {
  const {ieee} = useParams<{ ieee: string }>();
  const [showDialog, setShowDialog] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [autoExit, setAutoExit] = useState(false);
  const history = useHistory();
  const {zespRequestAsync} = useContext(ZespContext);
  const deviceInfo = useSelector((state: RootState) => getDeviceByIee(state, ieee), deviceUpdateDetector);
  const groups = deviceInfo && Devices.getControlGroups(deviceInfo);

  if (!deviceInfo) throw new Error("Device information not found");

  const _returnBack = () => history.push("/devices");

  const onDebugDeviceHandler = () => {
    console.log(deviceInfo);
    toast.success("Check console for debug info", {icon: "👽"});
  }

  const onDeleteDeviceHandler = () => {
    _returnBack();
    // zespSend({data: "getDeviceList"});

    zespRequestAsync({
      data: `removeDevice|${deviceInfo.zespInfo.Device}|${deviceInfo.zespInfo.IEEE}`,
      // data: "getDeviceList",
      responseValidator: TypedZespResponseValidator("alldev")
    })
      .then(() => {
        toast.success("Device deleted", {icon: "😵‍💫"});
      })
      .catch(reason => {
        toast.error("Cannot delete selected device", {duration: 3000});
        setShowDialog(true);
      });
  }

  const onSettingsHandler = () => {
    setShowDialog(false);
    setShowSettings(true);
  }

  const onSettingsClosedHandler = () => {
    setShowSettings(false);
    setShowDialog(true);
  }

  const onReportsHandler = () => {
    history.push(`/device/template/${deviceInfo.zespInfo.IEEE}`)
  }

  const onExitHandler = () => {
    if (!autoExit) return;
    setTimeout(_returnBack, 100)
  };

  const onCloseClickHandler = () => {
    setAutoExit(true);
    setShowDialog(false)
  };

  return {
    deviceInfo,
    groups,
    showDialog,
    showSettings,

    onExitHandler,
    onDebugDeviceHandler,
    onDeleteDeviceHandler,
    onCloseClickHandler,
    onSettingsHandler,
    onSettingsClosedHandler,
    onReportsHandler,
  }
}

const deviceUpdateDetector = (a: DeviceInfo | undefined, b: DeviceInfo | undefined) => {
  if (!a || !b) return false;
  const keysA = Object.keys(a.zespInfo.Report);
  const keysB = Object.keys(b.zespInfo.Report);

  if (keysA.length != keysB.length) return false;
  for (const key of keysA) {
    if (a.zespInfo.Report[key] !== b.zespInfo.Report[key]) return false;
  }

  if (a.zespInfo.Name !== b.zespInfo.Name) return false;
  if (a.zespInfo.Location !== b.zespInfo.Location) return false;

  return true;
}