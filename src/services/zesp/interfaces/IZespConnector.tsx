import {IZespResponseValidator} from "./IZespResponseValidator";
import {ZespDataEvent} from "../common/ZespDataEvent";
import {IServerInfo} from "../../../pages/welcome/interfaces";

interface ISendArgs {
  data: string,
  isBinary?: boolean | null
}

interface IRequestAsyncArgs extends ISendArgs {
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
  connectAsync: (server: IServerInfo, zespConnectedAction: ZespConnectedAction) => Promise<IZespConnector>;
  disconnect: () => void,
  reconnectAsync: (force: boolean, zespConnectedAction: ZespConnectedAction) => Promise<void>;
  send: (args: ISendArgs) => void;
  requestAsync: (args: IRequestAsyncArgs) => Promise<ZespDataEvent>;
  request: (args: IRequestArgs) => Promise<IZespConnector>;
  subscribe: (validator: IZespResponseValidator, handler: ZespConnectorHandler) => ZespConnectorListener
  unsubscribe: (listener: ZespConnectorListener) => void,

  getServerAddress: () => string | undefined,
}

export type ZespConnectedAction = (state: boolean) => void;