import {ZespSettings} from "./models/ZespSettings";
import {Single} from "../single";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";

export default {
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
  }
}

function parseResponse(jsonString: string): ZespSettings {
  const json = JSON.parse(jsonString);
  const result = {} as ZespSettings;
  Object.assign(result, json);

  return result;
}
