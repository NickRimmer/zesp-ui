import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";
import {ZespDataEvent} from "./ZespDataEvent";
import {zespConnectionStatus} from "../../../store/slices/zespSlice";
import useZespConnector from "./service-connector";

export interface ISendArgs {
  data: string,
  isBinary?: boolean | null
}

export interface IRequestAsyncArgs extends ISendArgs {
  responseValidator: IZespResponseValidator,
  timeoutSeconds?: number,
}

export type ZespConnectorListener = (event: Event) => void;
export type ZespConnectorHandler = (event: ZespDataEvent) => void;
export type ZespConnectedAction = (status: zespConnectionStatus) => void;
export type IZespConnector = ReturnType<typeof useZespConnector>;