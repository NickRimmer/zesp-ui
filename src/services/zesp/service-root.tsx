import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespRootData} from "./models/ZespRootData";
import {GetCurrentDeviceAction} from "./interfaces/GetDeviceAction";
import {UpdateDevicesAction} from "./interfaces/UpdateDevicesAction";


export default {
  getRootData: (zesp: IZespConnector, getRootDeviceAction: GetCurrentDeviceAction, devicesUpdate: UpdateDevicesAction) => {
    return zesp.request({
      data: "get_Mi_lamp",
      responseValidator: TypedZespResponseValidator("Mi_lamp"),
      onSuccess: (event) => onDataReceived(event, getRootDeviceAction, devicesUpdate)
    })
  }
}

const onDataReceived = (event: ZespDataEvent, getRootDeviceAction: GetCurrentDeviceAction, devicesUpdate: UpdateDevicesAction): void => {

  const device = getRootDeviceAction();
  if (!device) {
    console.debug("Update received, but no root devices found")
    return;
  }

  const data = JSON.parse(event.dataParts[0]) as ZespRootData;

  const layoutSettings = device.customLayout;
  if (!layoutSettings) {
    console.warn("Update received, but no root layout found");
    // console.debug(globalState.state.devices);
    return;
  }

  const reportOnOff = layoutSettings.find(x => x.id === "on_off_root")?.reportKey;
  if (reportOnOff) device.zespInfo.Report[reportOnOff.endpoint + reportOnOff.clusterId + reportOnOff.attributeId].val = data.on.toString();
  else console.warn("Root device report 'on_off_root' not found");

  const reportLevel = layoutSettings.find(x => x.id === "level_root")?.reportKey;
  if (reportLevel) device.zespInfo.Report[reportLevel.endpoint + reportLevel.clusterId + reportLevel.attributeId].val = data.level.toString();
  else console.warn("Root device report 'level_root' not found");

  // ZESP returns wrong colors red and blue swapped
  const reportRgb = layoutSettings.find(x => x.id === "rgb_root")?.reportKey;
  if (reportRgb) device.zespInfo.Report[reportRgb.endpoint + reportRgb.clusterId + reportRgb.attributeId].val = `${data.B}:${data.G}:${data.R}`;
  else console.warn("Root device report 'rgb_root' not found");

  const volumeLevel = layoutSettings.find(x => x.id === "level_control")?.reportKey;
  if (volumeLevel) device.zespInfo.Report[volumeLevel.endpoint + volumeLevel.clusterId + volumeLevel.attributeId].val = data.sound.volume.toString();
  else console.warn("Root device report 'level_control' not found");

  const srcRadio = layoutSettings.find(x => x.id === "player_src_root")?.reportKey;
  if (srcRadio) device.zespInfo.Report[srcRadio.endpoint + srcRadio.clusterId + srcRadio.attributeId].val = data.sound.current_path?.toString();
  else console.warn("Root device report 'player_src_root' not found");

  const playControl = layoutSettings.find(x => x.id === "player_control_root")?.reportKey;
  if (playControl) device.zespInfo.Report[playControl.endpoint + playControl.clusterId + playControl.attributeId].val = data.sound.play.toString();
  else console.warn("Root device report 'player_control_root' not found");

  devicesUpdate([device]);
}
