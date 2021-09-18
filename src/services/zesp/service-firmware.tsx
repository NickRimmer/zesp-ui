import {IZespConnector} from "./interfaces/IZespConnector";
import {FirmwareInfo} from "../../models/FirmwareInfo";
import {TypedZespResponseValidator} from "./common/ZespResponseValidators";
import {DictionaryStrings} from "../../models/DictionaryStrings";

export default {
  getFirmwareInfoAsync: (zesp: IZespConnector): Promise<FirmwareInfo> => zesp
    .zespRequestAsync({
      data: "loadfwlist",
      responseValidator: TypedZespResponseValidator("rsploadfwlist"),
      timeoutSeconds: 15,
    }).then(event => {
      if (event.dataParts.length < 2) throw Error("Unexpected zesp firmware information response");

      const updates = JSON.parse(event.dataParts[0]) as DictionaryStrings[];
      const currentVersion = event.dataParts[1];
      if (!updates || updates.length === 0) throw Error("Unexpected zesp firmware udpates response");
      if (!currentVersion || currentVersion.length === 0) throw Error("Unexpected zesp current version response");

      const result: FirmwareInfo = {
        currentVersion,
        updatesInformation: updates[0]
      };

      return result;
    }),
}
