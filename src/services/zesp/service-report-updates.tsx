import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {IGlobalState} from "../../global-state";
import {ZespDeviceUpdate} from "./models/ZespDeviceUpdate";

export default {
  subscribeToEvents: (zesp: IZespConnector, getGlobalState: () => IGlobalState) => {
    zesp.subscribe(TypedZespResponseValidator("rep"), event => onUpdate(event, getGlobalState))
  }
}

const onUpdate = (event: ZespDataEvent, getGlobalState: () => IGlobalState): void => {
  // we are expecting 'rep|{...}' string
  if (event.dataParts.length < 2) {
    console.warn("Unknown format of updated received");
    console.warn(event.response);
    return;
  }

  const globalState = getGlobalState();
  const devices = globalState.state.devices;
  const ieee = event.dataParts[1];
  const device = devices?.find(x => x.zespInfo.IEEE === ieee);

  if (!device) {
    console.debug(`Update received for unknown device: ${ieee}`);
    return;
  }

  const data = JSON.parse(event.dataParts[0]) as ZespDeviceUpdate;
  const reportId = data.EndPoint + data.ClusterId + data.AttribId;
  const report = device.zespInfo.Report[reportId];

  if (!report) {
    console.debug(`Report '${reportId}' not found for '${device.zespInfo.IEEE}' device (${device.zespInfo.Name ?? device.zespInfo.ModelId})`);
    // console.debug(data);
    return;
  }

  if (report.val !== data.Data && report.parsed !== data.parsed) {
    report.parsed = data.parsed;
    report.val = data.Data;
    globalState.setState(x => ({...x, ...{devices: devices}}));
  }

  // console.debug(`Device '${device.IEEE}' (${device.Name ?? device.ModelId}) report '${reportId}' updated with value '${data.Data}'`);
}