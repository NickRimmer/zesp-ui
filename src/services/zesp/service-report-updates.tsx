import {IZespConnector} from "./interfaces/IZespConnector";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {ZespDeviceUpdate} from "./models/ZespDeviceUpdate";
import {ZespReportInfo} from "./models/ZespReportInfo";

export default {
  subscribeToEvents: (zesp: IZespConnector, onReport: (ieee: string, reportKey: string, updates: Partial<ZespReportInfo>) => void) => {
    zesp.subscribe(TypedZespResponseValidator("rep"), event => onUpdate(event, onReport))
  }
}

const onUpdate = (event: ZespDataEvent, onReport: (ieee: string, reportKey: string, updates: Partial<ZespReportInfo>) => void): void => {
  // we are expecting 'rep|{...}' string
  if (event.dataParts.length < 2) {
    console.warn("Unknown format of updated received");
    console.warn(event.response);
    return;
  }

  const ieee = event.dataParts[1];
  const data = JSON.parse(event.dataParts[0]) as ZespDeviceUpdate;
  const reportKey = data.EndPoint + data.ClusterId + data.AttribId;
  const report = {
    parsed: data.parsed,
    val: data.Data,
    time: data.time,
  } as Partial<ZespReportInfo>

  onReport(ieee, reportKey, report);
}