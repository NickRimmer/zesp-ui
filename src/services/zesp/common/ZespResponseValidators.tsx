import {ZespDataEvent} from "./ZespDataEvent";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";
import {ZespDeviceUpdate} from "../models/ZespDeviceUpdate";

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

export const ReportZespResponseValidator = (deviceId: string, endpointId: string, clusterId: string, attributeId: string) => ({
  name: ReportZespResponseValidator.name,
  isValid: (event: ZespDataEvent) => {
    if (!event.dataType || event.dataType !== "rep") return false
    if (event.dataParts.length < 1) return false
    const response = JSON.parse(event.dataParts[0]) as ZespDeviceUpdate

    if (!response.ShortAddr || response.ShortAddr !== deviceId) return false;
    if (!response.EndPoint || response.EndPoint !== endpointId) return false;
    if (!response.ClusterId || response.ClusterId !== clusterId) return false;
    if (!response.AttribId || response.AttribId !== attributeId) return false;

    return true;
  }
})

export const AllMessagesZespResponseValidator: IZespResponseValidator = ({
  name: "AllZespResponseValidator",
  isValid: (event => true)
});