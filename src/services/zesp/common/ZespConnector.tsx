import {Websocket, WebsocketBuilder} from "websocket-ts";
import Constants from "./Constants";
import {ZespDataEvent, ZespDataEventType} from "./ZespDataEvent";
import {IGlobalState} from "../../../global-state";
import {IZespConnector, ZespConnectorHandler, ZespConnectorListener} from "../interfaces/IZespConnector";
import {Single} from "../../single";
import {CloseEventCodes} from "../enums/CloseEventCodes";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";

const zespHost = "192.168.3.30"; //TODO read host from config

let _ws: Websocket;
let _globalState: IGlobalState;
const onMessageEvent = new EventTarget();

const ZespConnector: IZespConnector = {
  connectAsync: (globalState) => new Promise<IZespConnector>((resolve, reject) => {
    if (_globalState) {
      console.warn("ZespConnector already initialized");
      resolve(Single.ZespConnector);
      return;
    }

    _globalState = globalState;

    // start with delay
    setTimeout(() => ZespConnector.reconnectAsync(true)
        .then(() => resolve(Single.ZespConnector))
        .catch(error => reject(error)),
      Constants.ConnectionStartTimeout);

    // setup watchdog
    setInterval(() => ZespConnector.reconnectAsync(false)
        .then(() => resolve(Single.ZespConnector))
        .catch(error => reject(error)),
      Constants.VerifyConnectionTimeout);

    return ZespConnector;
  }),

  reconnectAsync: (force) => new Promise<void>((resolve, reject) => {
    if (!_globalState) {
      reject("ZespConnector is not initialized yet");
      // throw new Error("ZespConnector is not initialized yet")
    }

    // check if already connected
    if (_ws?.underlyingWebsocket?.readyState === 1 && !force) {
      resolve();
      return;
    }

    // create new connection
    console.debug("Start ws connection...");
    try {
      _ws.close(CloseEventCodes.Restart);
    } catch {
      // it's ok :P
    }

    _globalState.setState(prevState => ({...prevState, ...{zespConnected: false}}))
    _ws = new WebsocketBuilder(`ws://${zespHost}:81`)
      .onOpen(() => {
        onConnectionOpen();
        resolve();
      })
      .onClose(onConnectionClosed)
      .onError(() => {
        onConnectionError();
        reject("zesp connection error")
      })
      .onMessage(onMessageReceived)
      .build();
  }),

  send: (data) => {
    if (!_globalState) throw new Error("ZespConnector is not initialized yet");
    _ws.send(data);
  },

  requestAsync: ({data, responseValidator, timeoutSeconds}) => new Promise<ZespDataEvent>(((resolve, reject) => {
    if (!timeoutSeconds || timeoutSeconds <= 0) timeoutSeconds = Constants.DefaultRequestTimeoutSeconds;
    let responseReceived = false;

    const validator = responseValidator;

    // on response received from zesp
    const listener = (event: Event) => {
      const result = event as ZespDataEvent;
      if (!validator.isValid(result)) return;

      responseReceived = true;
      onMessageEvent.removeEventListener(ZespDataEventType, listener);
      resolve(result);
    }

    // if no response for a specific time (timeout)
    const onTimeout = () => {
      if (responseReceived) return;

      onMessageEvent.removeEventListener(ZespDataEventType, listener);
      console.warn(`zesp response did not received (timeout: ${timeoutSeconds} seconds)`);
      reject("timeout");
    };

    // send request
    try {
      onMessageEvent.addEventListener(ZespDataEventType, listener);
      ZespConnector.send(data)
      setTimeout(onTimeout, timeoutSeconds * 1000);
    } catch (error) {
      reject(`exception: ${error}`);
    }
  })),

  request: (args) => new Promise<IZespConnector>((resolve, reject) => {
    ZespConnector
      .requestAsync(args)
      .then(event => {
        if (args.onSuccess) args.onSuccess(event);
        else console.debug(`zesp request completed (${args.responseValidator.name})`);

        resolve(Single.ZespConnector);
      })
      .catch(error => {
        const errorMessage = `${error} (${args.responseValidator.name}; ${args.data})`;

        if (args.onError) args.onError(errorMessage);
        else console.warn(`zesp request failed: ${errorMessage}`);
        reject(errorMessage);
      });
  }),

  subscribe: (validator: IZespResponseValidator, handler: ZespConnectorHandler): ZespConnectorListener => {
    const listener = (event: Event): void => {
      const zespEvent = event as ZespDataEvent;
      if (!validator.isValid(zespEvent)) return;

      handler(zespEvent);
    }

    onMessageEvent.addEventListener(ZespDataEventType, listener)
    return listener;
  },

  unsubscribe: (listener: ZespConnectorListener) => onMessageEvent.removeEventListener(ZespDataEventType, listener)
};

const onConnectionOpen = () => {
  console.debug("Zesp connection opened");
  _globalState.setState(prevState => ({...prevState, ...{zespConnected: true}}));
}

const onConnectionClosed = () => {
  console.debug("Zesp connection closed");
  _globalState.setState(prevState => ({...prevState, ...{zespConnected: false}}));
}

const onConnectionError = () => {
  console.debug("Zesp connection error happened )=");
}

const onMessageReceived = (ws: Websocket, e: MessageEvent) => {
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
  // console.debug(resultEvent);
  onMessageEvent.dispatchEvent(resultEvent);
}

export default ZespConnector;
