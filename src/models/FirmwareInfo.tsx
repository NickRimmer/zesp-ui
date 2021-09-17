import {DictionaryStrings} from "./DictionaryStrings";

/* Firmware information received from ZESP */
export type FirmwareInfo = {
  currentVersion: string,
  updatesInformation: DictionaryStrings,
}