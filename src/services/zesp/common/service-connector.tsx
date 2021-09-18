import {Websocket, WebsocketBuilder} from "websocket-ts";
import {IServerInfo} from "../../../pages/welcome/interfaces";
import Constants from "./Constants";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";
import {ZespDataEvent, ZespDataEventType} from "./ZespDataEvent";
import {IRequestAsyncArgs, ISendArgs, ZespConnectedAction, ZespConnectorHandler, ZespConnectorListener} from "./service-connector.interfaces";

//TODO move ZespConnectedAction to service-connector.interfaces.tsx

export const useZespConnector = () => {
  const _onMessageEvent = new EventTarget();
  let _ws: Websocket | undefined = undefined;
  let _server: IServerInfo | undefined;

  const _onMessageReceived = (ws: Websocket, e: MessageEvent) => {
    const messageParts = e.data
      .replace(/\|(?=([^"]*"[^"]*")*[^"]*$)/ig, "\x00")
      .split("\x00");

    if (messageParts.length == 0) {
      console.warn("Received empty message from zesp");
      return;
    }

    let messageType = messageParts.shift();

    const jsonMatch = /\/(.+)\.json/ig.exec(messageType);
    if (jsonMatch) {
      messageParts.unshift(messageType);
      messageType = "json";
    }

    const resultEvent = new ZespDataEvent(messageType, messageParts, e.data);
    _onMessageEvent.dispatchEvent(resultEvent);
  }

  const _tryToCloseWS = (): boolean => {
    if (_ws) {
      try {
        _ws.close(1000);
        return true;
      } catch {
        // it's ok :P
      }
    }
    return false;
  }

  const _tryConnectWs = (zespStatusChangeHandler: ZespConnectedAction) => new Promise<void>((resolve, reject) => {
    const protocol = document.location.protocol === "https:" ? "wss" : "ws";
    const serverAddress = `${protocol}://${_server!.address}:81`;
    console.debug(`Create connection to ${serverAddress}`)
    _ws = new WebsocketBuilder(serverAddress)
      .onOpen(() => {
        console.debug("ZESP connected");
        zespStatusChangeHandler("connected");
        resolve();
      })
      .onClose(() => {
        console.debug("ZESP connection closed");
        zespStatusChangeHandler("closed");
        reject("ZESP connection closed");
      })
      .onError(() => reject("ZESP connection error"))
      .onMessage(_onMessageReceived)
      .build();
  });

  const _getBinaryData = (message: string): Uint8Array => {
    const data = message.replaceAll(" ", "");
    const dataHex = data.match(/[\da-f]{2}/gi)?.map(group => parseInt(group, 16)) as ArrayLike<number>;
    return new Uint8Array(dataHex);
  }

  const connectAsync = (server: IServerInfo, zespStatusChangeHandler: ZespConnectedAction, force: boolean) => {
    _server = server;
    return new Promise<void>((resolve, reject) => {
      console.debug("Start WS connection...");

      if (!force) {
        if (_ws?.underlyingWebsocket?.readyState === 0) {
          reject("Already connecting");
          return;
        }

        if (_ws?.underlyingWebsocket?.readyState === 1) {
          console.debug("ZESP already connected, skip connection");
          resolve();
          return;
        }
      }

      _tryToCloseWS();
      _tryConnectWs(zespStatusChangeHandler)
        .then(resolve)
        .catch(reject);
    })
  }

  const zespSend = (args: ISendArgs): void => {
    if (!_ws) {
      console.warn("WebSocket client is not initialized yet");
      return;
    }

    const data = args.isBinary === true
      ? _getBinaryData(args.data)
      : args.data;

    _ws.send(data);
  }

  //TODO move request to separate hook
  const zespRequestAsync = (args: IRequestAsyncArgs) => new Promise<ZespDataEvent>((resolve, reject) => {
    if (!args.timeoutSeconds || args.timeoutSeconds <= 0) args.timeoutSeconds = Constants.DefaultRequestTimeoutSeconds;
    if (args.isBinary !== true) args.isBinary = false;

    let responseReceived = false;
    const validator = args.responseValidator;

    // on response received from zesp
    const listener = (event: Event) => {
      const result = event as ZespDataEvent;
      if (!validator.isValid(result)) return;

      responseReceived = true;
      _onMessageEvent.removeEventListener(ZespDataEventType, listener);
      resolve(result);
    }

    // if no response for a specific time (timeout)
    const onTimeout = () => {
      if (responseReceived) return;

      _onMessageEvent.removeEventListener(ZespDataEventType, listener);
      console.warn(`zesp response did not received (timeout: ${args.timeoutSeconds} seconds)`);
      reject("timeout");
    };

    // send request
    try {
      _onMessageEvent.addEventListener(ZespDataEventType, listener);
      zespSend({data: args.data, isBinary: args.isBinary})
      setTimeout(onTimeout, args.timeoutSeconds * 1000);
    } catch (error) {
      reject(`exception: ${error}`);
    }
  })

  const subscribe = (validator: IZespResponseValidator, handler: ZespConnectorHandler): ZespConnectorListener => {
    const listener = (event: Event): void => {
      const zespEvent = event as ZespDataEvent;
      if (!validator.isValid(zespEvent)) return;

      handler(zespEvent);
    }

    _onMessageEvent.addEventListener(ZespDataEventType, listener)
    return listener;
  }

  const unsubscribe = (listener: ZespConnectorListener) => _onMessageEvent.removeEventListener(ZespDataEventType, listener)

  const getServerAddress = () => _server?.address;

  return {
    connectAsync,
    zespSend,
    zespRequestAsync,
    subscribe,
    unsubscribe,
    getServerAddress,
  }
}

export default useZespConnector;