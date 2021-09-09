import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespRootData} from "./models/ZespRootData";
import {ZespReportInfo} from "./models/ZespReportInfo";
import {getDeviceModelSettings} from "./service-devices";

export default {
  getRootDataAsync: (zesp: IZespConnector) => new Promise<ZespReportUpdates>((resolve, reject) => {
    zesp.requestAsync({
      data: "get_Mi_lamp",
      responseValidator: TypedZespResponseValidator("Mi_lamp"),
    })
      .then(event => {
        const result = extractReports(event);

        if (result) resolve(result);
        else reject("Cannot update root device information");
      })
      .catch(reason => reject(reason));
  }),
}

export type ZespReportUpdates = {
  [key: string]: Partial<ZespReportInfo>
}

const extractReports = (event: ZespDataEvent): ZespReportUpdates => {
  const {controls} = getDeviceModelSettings("ZESP_Root");
  if (controls.length == 0) return {};

  const data = JSON.parse(event.dataParts[0]) as ZespRootData;
  const result: ZespReportUpdates = {};

  const reportOnOff = controls.find(x => x.id === "on_off_root")?.reportKey;
  if (reportOnOff) result[reportOnOff.endpoint + reportOnOff.clusterId + reportOnOff.attributeId] = {val: data.on.toString()};
  else console.warn("Root device report 'on_off_root' not found");

  const reportLevel = controls.find(x => x.id === "level_root")?.reportKey;
  if (reportLevel) result[reportLevel.endpoint + reportLevel.clusterId + reportLevel.attributeId] = {val: data.level.toString()};
  else console.warn("Root device report 'level_root' not found");

  // ZESP returns wrong colors red and blue swapped
  const reportRgb = controls.find(x => x.id === "rgb_root")?.reportKey;
  if (reportRgb) result[reportRgb.endpoint + reportRgb.clusterId + reportRgb.attributeId] = {val: `${data.B}:${data.G}:${data.R}`};
  else console.warn("Root device report 'rgb_root' not found");

  const volumeLevel = controls.find(x => x.id === "level_control")?.reportKey;
  if (volumeLevel) result[volumeLevel.endpoint + volumeLevel.clusterId + volumeLevel.attributeId] = {val: data.sound.volume.toString()};
  else console.warn("Root device report 'level_control' not found");

  const srcRadio = controls.find(x => x.id === "player_src_root")?.reportKey;
  if (srcRadio) result[srcRadio.endpoint + srcRadio.clusterId + srcRadio.attributeId] = {val: data.sound.current_path?.toString()};
  else console.warn("Root device report 'player_src_root' not found");

  const playControl = controls.find(x => x.id === "player_control_root")?.reportKey;
  if (playControl) result[playControl.endpoint + playControl.clusterId + playControl.attributeId] = {val: data.sound.play.toString()};
  else console.warn("Root device report 'player_control_root' not found");

  return result;
}

