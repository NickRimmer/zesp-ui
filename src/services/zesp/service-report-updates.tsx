import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {IGlobalState} from "../../global-state";
import {DeviceUpdate} from "./models/DeviceUpdate";

export default {
  subscribeToEvents: (zesp: IZespConnector, getGlobalState: () => IGlobalState) => {
    zesp.subscribe(TypedZespResponseValidator("rep"), event => onUpdate(event, getGlobalState))
  }
}

const onUpdate = (event: ZespDataEvent, getGlobalState: () => IGlobalState): void => {
  if (event.dataParts.length < 2) {
    console.warn("Unknown format of updated received")
    console.warn(event.response)
    return;
  }

  const globalState = getGlobalState();
  const ieee = event.dataParts[1];
  const devices = globalState.state.devices;
  const device = devices?.find(x => x.IEEE === ieee);
  if (!device) {
    console.debug(`Update received for unknown device: ${ieee}`);
    // console.debug(devices);
    return;
  }

  const data = JSON.parse(event.dataParts[0]) as DeviceUpdate;
  const reportId = data.EndPoint + data.ClusterId + data.AttribId;
  const report = device.Report[reportId];

  if (!report) {
    console.debug(`Report '${reportId}' not found for '${device.IEEE}' device (${device.Name ?? device.ModelId})`);
    console.debug(data);
    return;
  }

  report.val = data.Data;
  globalState.setState(x => ({...x, ...{devices: devices}}));
  // console.debug(`Device '${device.IEEE}' (${device.Name ?? device.ModelId}) report '${reportId}' updated with value '${data.Data}'`);
}