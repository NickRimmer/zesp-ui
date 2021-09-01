import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {IGlobalState} from "../../global-state";
import {ZespRootData} from "./models/ZespRootData";

export default {
  getRootData: (zesp: IZespConnector) => {
    return zesp.request({
      data: "get_Mi_lamp",
      responseValidator: TypedZespResponseValidator("Mi_lamp"),
      onSuccess: (event) => onDataReceived(event, zesp.getGlobalState())
    })
  }
}

const onDataReceived = (event: ZespDataEvent, globalState: IGlobalState): void => {
  const devices = globalState.state.devices;
  if (!devices) {
    console.debug("Update received, but no any devices found")
    return;
  }

  const data = JSON.parse(event.dataParts[0]) as ZespRootData;
  const device = devices.find(x => x.zespInfo.ModelId === "ZESP_Root");
  if (!device) {
    console.debug("Update received, but no root devices found")
    return;
  }

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

  globalState.setState(x => ({...x, ...{devices: devices}}));
}
