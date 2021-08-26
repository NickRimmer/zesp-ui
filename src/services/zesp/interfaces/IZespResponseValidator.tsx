import {ZespDataEvent} from "../common/ZespDataEvent";

export interface IZespResponseValidator {
  isValid(event: ZespDataEvent): boolean,

  name: string
}
