import {DictionaryStrings} from "./DictionaryStrings";

export type UiSettings = {
  firmwareUpdate: DictionaryStrings | undefined,
  firmwareLastCheck: number | undefined,
}

export const UiDefaultSettings: UiSettings = {} as UiSettings;