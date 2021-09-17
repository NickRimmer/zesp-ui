import {ZespSettings} from "./models/ZespSettings";
import {Single} from "../single";
import {JsonZespResponseValidator, TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {UiSettings} from "../../models/UiSettings";

const ServiceSettings = {
  getAsync: (): Promise<ZespSettings> => new Promise<ZespSettings>((resolve, reject) => {
    Single.ZespConnector.requestAsync({data: "loadConfig", responseValidator: TypedZespResponseValidator("jsconfig")})
      .then(event => parseResponse(event.dataParts[0]))
      .then(settings => resolve(settings))
      .catch(error => reject(error));
  }),

  setAsync: (settings: ZespSettings): Promise<void> => {
    const data = [
      "SaveJson",
      "/jsconfig.txt",
      JSON.stringify(settings)
    ].join("|");

    return new Promise((resolve, reject) => {
      Single.ZespConnector.requestAsync({data: data, responseValidator: TypedZespResponseValidator("ZD_RSP")})
        .then(event => {
          // console.log(event);
          if (event.dataParts[1].toLocaleLowerCase() === "ok") resolve();
          else reject(`Settings was not saved: ${event.response}`)
        })
        .catch(error => reject(error));
    })
  },

  getCustomAsync: function getCustom<T>(name: string): Promise<T | undefined> {
    return Single.ZespConnector
      .requestAsync({
        data: `LoadJson|/${name}.json`,
        responseValidator: JsonZespResponseValidator(name)
      })
      .then(event => {
        if (event.dataParts.length < 1) throw new Error("Unexpected JSON file response from ZESP");
        const jsonStr = event.dataParts[1];

        if (!jsonStr || jsonStr.length === 0 || jsonStr.trim().toLocaleLowerCase() === "null") return undefined;
        return JSON.parse(jsonStr) as T;
      })
  },

  setUiSettings: (data: UiSettings): void => {
    ServiceSettings.setCustom("zesp_ui", data);
  },

  setCustom: function setCustom<T>(name: string, data: T): void {
    const fileName = `/${name}.json`;
    const dataStr = JSON.stringify(data);

    Single.ZespConnector.send({
      data: `SaveJson|${fileName}|${dataStr}`
    });
  }
}

function parseResponse(jsonString: string): ZespSettings {
  const json = JSON.parse(jsonString);
  const result = {} as ZespSettings;
  Object.assign(result, json);

  return result;
}

export default ServiceSettings;