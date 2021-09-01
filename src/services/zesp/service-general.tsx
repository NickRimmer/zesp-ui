import {Single} from "../single";
import {IGlobalState} from "../../global-state";
import ServiceDevices from "./service-devices";
import ServiceReportUpdates from "./service-report-updates";
import ServiceRoot from "./service-root";

const send = (data: string) => Single.ZespConnector.send({data: data});
let isInitialized = false;

export default {
  initAsync: (getGlobalState: () => IGlobalState): Promise<void> => new Promise<void>((resolve, reject) => {
    if (isInitialized) {
      console.warn("zesp service already initialized");
      resolve();
      return;
    }

    isInitialized = true;
    console.debug("Load initial data from zesp...");

    //TODO move each promise to fn
    Single.ZespConnectorPromise
      // .then(zesp => zesp.request({data: "LoadJson|/groups.json", responseValidator: JsonZespResponseValidator("groups"), onSuccess: onGroupsReceived}))
      // .then(zesp => zesp.request({data: "LoadJson|/location.json", responseValidator: JsonZespResponseValidator("location"), onSuccess: onLocationsReceived}))
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
}

// function onGroupsReceived(event: ZespDataEvent) {
//   console.log("groups received");
// }
//
// function onLocationsReceived(event: ZespDataEvent) {
//   console.log("locations received");
// }