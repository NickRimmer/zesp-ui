import {ZespDataEvent} from "./ZespDataEvent";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";

export const JsonZespResponseValidator = (fileName: string): IZespResponseValidator => ({
  name: JsonZespResponseValidator.name,
  isValid: (event: ZespDataEvent) => {
    if (event.dataType !== "json") return false;
    const responseFileName = event.dataParts[0];
    const foundFileName = (/\/(.+)\.json/ig.exec(responseFileName) as string[])[1];

    return foundFileName === fileName;
  }
});

export const TypedZespResponseValidator = (dataType: string): IZespResponseValidator => ({
  name: TypedZespResponseValidator.name,
  isValid: (event: ZespDataEvent) => event.dataType === dataType
});