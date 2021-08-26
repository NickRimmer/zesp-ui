import {Single} from "../single";
import {JsonZespResponseValidator, TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {ZespDataEvent} from "./common/ZespDataEvent";

const send = (data: string | ArrayBufferLike | Blob | ArrayBufferView) => Single.ZespConnector.send(data);
let isInitialized = false;

export default {
  initAsync: (): Promise<void> => new Promise<void>((resolve, reject) => {
    if (isInitialized) {
      console.warn("zesp service already initialized");
      resolve();
      return;
    }

    isInitialized = true;
    console.debug("Load initial data from zesp...");

    Single.ZespConnectorPromise
      .then(zesp => zesp.request({data: "LoadJson|/groups.json", responseValidator: JsonZespResponseValidator("groups"), onSuccess: onGroupsReceived}))
      .then(zesp => zesp.request({data: "LoadJson|/location.json", responseValidator: JsonZespResponseValidator("location"), onSuccess: onLocationsReceived}))
      .then(zesp => zesp.request({data: "get_Mi_lamp", responseValidator: TypedZespResponseValidator("Mi_lamp"), onSuccess: onMiLampDataReceived}))
      .then(zesp => zesp.request({data: "getDeviceList", responseValidator: TypedZespResponseValidator("alldev"), onSuccess: onDevicesListReceived}))
      .then(zesp => zesp.subscribe(TypedZespResponseValidator("rep"), onDevicesUpdate))
      .then(() => resolve())
      .catch(error => {
        console.error(`Cannot complete zesp service initialization: ${error}`);
        reject(error);
      });
  }),

  ping: () => send("ping"),
  // loadConfigAsync: () => Single.ZespConnector.requestAsync({data: "loadConfig", responseValidator: TypedZespResponseValidator("jsconfig")})
}

function onGroupsReceived(event: ZespDataEvent) {
  console.log("groups received");
}

function onLocationsReceived(event: ZespDataEvent) {
  console.log("locations received");
}

function onMiLampDataReceived(event: ZespDataEvent) {
  console.log("MI Lamp data received");
}

function onDevicesListReceived(event: ZespDataEvent) {
  console.log("List of devices received");
}

function onDevicesUpdate(event: ZespDataEvent) {
  console.log(`Device update received: ${event.dataParts[1]}`);
}