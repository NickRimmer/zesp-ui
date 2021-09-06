import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespDeviceUpdate} from "./models/ZespDeviceUpdate";
import {GetDeviceAction} from "./interfaces/GetDeviceAction";
import {UpdateDevicesAction} from "./interfaces/UpdateDevicesAction";

export default {
  subscribeToEvents: (zesp: IZespConnector, getDeviceAction: GetDeviceAction, updateDevicesAction: UpdateDevicesAction) => {
    zesp.subscribe(TypedZespResponseValidator("rep"), event => onUpdate(event, getDeviceAction, updateDevicesAction))
  }
}

const onUpdate = (event: ZespDataEvent, getDeviceAction: GetDeviceAction, updateDevicesAction: UpdateDevicesAction): void => {
  // we are expecting 'rep|{...}' string
  if (event.dataParts.length < 2) {
    console.warn("Unknown format of updated received");
    console.warn(event.response);
    return;
  }

  const ieee = event.dataParts[1];
  const device = getDeviceAction(ieee);

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
    updateDevicesAction([device]);
  }

  // console.debug(`Device '${device.IEEE}' (${device.Name ?? device.ModelId}) report '${reportId}' updated with value '${data.Data}'`);
}