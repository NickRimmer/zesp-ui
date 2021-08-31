import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {IGlobalState} from "../../global-state";
import {LayoutSettings} from "../../device-controls/settings";

export default {
  getRootData: (zesp: IZespConnector) => {
    return zesp.request({
      data: "get_Mi_lamp",
      responseValidator: TypedZespResponseValidator("Mi_lamp"),
      onSuccess: (event) => onDataReceived(event, zesp.getGlobalState())
    })
  }
}

type rootData = {
  on: 0 | 1,
  R: number,
  G: number,
  B: number,
  // X: number,
  // Y: number,
  level: number,
  // rgb_bgr: number,
  sound: {
    volume: number,
    current_path: string,
    play: "OFF" | "ON"
  },
  radio: string[],
}

const onDataReceived = (event: ZespDataEvent, globalState: IGlobalState): void => {
  const data = JSON.parse(event.dataParts[0]) as rootData;

  const devices = globalState.state.devices;
  const device = globalState.state.devices?.find(x => x.ModelId === "ZESP_Root");
  const layout = device?.details?.layout;

  if (!layout) {
    console.warn("Root device not updated, cause not layout file found");
    console.debug(globalState.state.devices);
    return;
  }

  const layoutSettings: LayoutSettings[] = require(`../../data/layouts/${layout}`);

  const reportOnOff = layoutSettings.find(x => x.id === "on_off_root")?.value;
  if (reportOnOff) device!.Report[reportOnOff.endpoint + reportOnOff.clusterId + reportOnOff.attributeId].val = data.on.toString();
  else console.warn("Root device report 'on_off_root' not found");

  const reportLevel = layoutSettings.find(x => x.id === "level_root")?.value;
  if (reportLevel) device!.Report[reportLevel.endpoint + reportLevel.clusterId + reportLevel.attributeId].val = data.level.toString();
  else console.warn("Root device report 'level_root' not found");

  const reportRgb = layoutSettings.find(x => x.id === "rgb_root")?.value;
  // ZESP returns wrong colors red and blue swapped
  if (reportRgb) device!.Report[reportRgb.endpoint + reportRgb.clusterId + reportRgb.attributeId].val = `${data.B}:${data.G}:${data.R}`;
  else console.warn("Root device report 'rgb_root' not found");

  globalState.setState(x => ({...x, ...{devices: devices}}));
}
