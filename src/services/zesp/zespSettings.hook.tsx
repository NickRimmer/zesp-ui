import {ZespSettings} from "./models/ZespSettings";
import {JsonZespResponseValidator, TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {UiSettings} from "../../models/UiSettings";
import {IZespConnector} from "./common/service-connector.interfaces";

export const useZespSettings = ({zespRequestAsync, zespSend}: IZespConnector) => {
  const getAsync = (): Promise<ZespSettings> => new Promise<ZespSettings>((resolve, reject) => {
    zespRequestAsync({data: "loadConfig", responseValidator: TypedZespResponseValidator("jsconfig")})
      .then(event => parseResponse(event.dataParts[0]))
      .then(settings => resolve(settings))
      .catch(error => reject(error));
  })

  const setAsync = (settings: ZespSettings): Promise<void> => {
    const data = [
      "SaveJson",
      "/jsconfig.txt",
      JSON.stringify(settings)
    ].join("|");

    return new Promise((resolve, reject) => {
      zespRequestAsync({data: data, responseValidator: TypedZespResponseValidator("ZD_RSP")})
        .then(event => {
          // console.log(event);
          if (event.dataParts[1].toLocaleLowerCase() === "ok") resolve();
          else reject(`Settings was not saved: ${event.response}`)
        })
        .catch(error => reject(error));
    })
  }

  const getCustomAsync = function getCustom<T>(name: string): Promise<T | undefined> {
    return zespRequestAsync({
      data: `LoadJson|/${name}.json`,
      responseValidator: JsonZespResponseValidator(name)
    })
      .then(event => {
        if (event.dataParts.length < 1) throw new Error("Unexpected JSON file response from ZESP");
        const jsonStr = event.dataParts[1];

        if (!jsonStr || jsonStr.length === 0 || jsonStr.trim().toLocaleLowerCase() === "null") return undefined;
        return JSON.parse(jsonStr) as T;
      })
  }

  const setCustom = function setCustom<T>(name: string, data: T): void {
    const fileName = `/${name}.json`;
    const dataStr = JSON.stringify(data);

    zespSend({
      data: `SaveJson|${fileName}|${dataStr}`
    });
  }

  const setUiSettings = (data: UiSettings): void => {
    setCustom("zesp_ui", data);
  }

  return {
    getAsync,
    setAsync,
    getCustomAsync,
    setCustom,
    setUiSettings,
  }
}

function parseResponse(jsonString: string): ZespSettings {
  const json = JSON.parse(jsonString);
  const result = {} as ZespSettings;
  Object.assign(result, json);

  return result;
}

export default useZespSettings;