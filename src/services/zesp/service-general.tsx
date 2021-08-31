import {Single} from "../single";
import {JsonZespResponseValidator, TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";
import {IGlobalState} from "../../global-state";
import ServiceDevices from "./service-devices";
import ServiceReportUpdates from "./service-report-updates";
import ServiceRoot from "./service-root";
import {ReportKey} from "../../models/ReportKey";
import {ReportDetails, ReportInfo} from "./models/DeviceInfo";

const send = (data: string) => Single.ZespConnector.send({data: data});
let isInitialized = false;
let _getGlobalState: () => IGlobalState;

export default {
  initAsync: (getGlobalState: () => IGlobalState): Promise<void> => new Promise<void>((resolve, reject) => {
    if (isInitialized) {
      console.warn("zesp service already initialized");
      resolve();
      return;
    }

    isInitialized = true;
    _getGlobalState = getGlobalState;
    console.debug("Load initial data from zesp...");

    //TODO move each promise to fn
    Single.ZespConnectorPromise
      .then(zesp => zesp.request({data: "LoadJson|/groups.json", responseValidator: JsonZespResponseValidator("groups"), onSuccess: onGroupsReceived}))
      .then(zesp => zesp.request({data: "LoadJson|/location.json", responseValidator: JsonZespResponseValidator("location"), onSuccess: onLocationsReceived}))
      .then(ServiceDevices.getDevicesList)
      .then(ServiceRoot.getRootData)
      .then(zesp => ServiceReportUpdates.subscribeToEvents(zesp, getGlobalState))
      .then(() => resolve())
      .catch(error => {
        console.error(`Cannot complete zesp service initialization: ${error}`);
        reject(error);
      });
  }),

  ping: () => send("ping"),

  setReportValue: (ieee: string, reportKey: ReportKey | ReportDetails, value: string) => {
    const devices = _getGlobalState().state.devices;
    const device = devices?.find(x => x.IEEE === ieee);

    if (!device) {
      console.error(`Cannot update report for unknown device with ieee ${ieee}`);
      return;
    }

    const reportId = reportKey.endpoint + reportKey.clusterId + reportKey.attributeId;
    const report = device.Report[reportId];
    if (!report) {
      console.warn(`Cannot set value for unknown report with key ${reportId}`);
      return;
    }

    report.val = value;
    _getGlobalState().setState(x => ({...x, ...{devices: devices}}));
  }

  // loadConfigAsync: () => Single.ZespConnector.requestAsync({data: "loadConfig", responseValidator: TypedZespResponseValidator("jsconfig")})
}

function onGroupsReceived(event: ZespDataEvent) {
  console.log("groups received");
}

function onLocationsReceived(event: ZespDataEvent) {
  console.log("locations received");
}