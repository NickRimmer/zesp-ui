import {IGlobalState} from "../../../global-state";
import {IZespResponseValidator} from "./IZespResponseValidator";
import {ZespDataEvent} from "../common/ZespDataEvent";

interface IRequestAsyncArgs {
  data: string | ArrayBufferLike | Blob | ArrayBufferView,
  responseValidator: IZespResponseValidator,
  timeoutSeconds?: number,
}

interface IRequestArgs extends IRequestAsyncArgs {
  onSuccess?: OnSuccessEvent,
  onError?: OnErrorEvent,
}

export type ZespConnectorListener = (event: Event) => void;
export type ZespConnectorHandler = (event: ZespDataEvent) => void;
export type OnSuccessEvent = (event: ZespDataEvent) => void;
export type OnErrorEvent = (error: string) => void;

export interface IZespConnector {
  connectAsync: (globalState: IGlobalState) => Promise<IZespConnector>;
  reconnectAsync: (force: boolean) => Promise<void>;
  send: (data: string | ArrayBufferLike | Blob | ArrayBufferView) => void;
  requestAsync: (args: IRequestAsyncArgs) => Promise<ZespDataEvent>;
  request: (args: IRequestArgs) => Promise<IZespConnector>;
  subscribe: (validator: IZespResponseValidator, handler: ZespConnectorHandler) => ZespConnectorListener
  unsubscribe: (listener: ZespConnectorListener) => void
}