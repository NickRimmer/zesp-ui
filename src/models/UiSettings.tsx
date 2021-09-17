import {DictionaryStrings} from "./DictionaryStrings";

export type UiSettings = {
  firmwareUpdate: DictionaryStrings | undefined,
  firmwareLastCheck: number | undefined,
  firmwareSkipUpdate: string | undefined,
}

export const UiDefaultSettings: UiSettings = {} as UiSettings;