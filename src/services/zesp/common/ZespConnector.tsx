import {Websocket, WebsocketBuilder} from "websocket-ts";
import Constants from "./Constants";
import {ZespDataEvent, ZespDataEventType} from "./ZespDataEvent";
import {IGlobalState} from "../../../global-state";
import {IZespConnector, ZespConnectorHandler, ZespConnectorListener} from "../interfaces/IZespConnector";
import {Single} from "../../single";
import {CloseEventCodes} from "../enums/CloseEventCodes";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";
import {IServerInfo} from "../../../pages/welcome/interfaces";

// const zespHost = "192.168.3.30"; //TODO read host from config

let _ws: Websocket;
let _globalState: IGlobalState;
let _server: IServerInfo | null;
const onMessageEvent = new EventTarget();
let _reconnecter: NodeJS.Timeout | null | undefined;

const ZespConnector: IZespConnector = {
  connectAsync: (globalState, server) => new Promise<IZespConnector>((resolve, reject) => {
    if (_globalState && _server) {
      console.warn("ZespConnector already initialized");
      resolve(Single.ZespConnector);
      return;
    }

    _globalState = globalState;
    _server = server;

    // start with delay
    setTimeout(() => ZespConnector.reconnectAsync(true)
        .then(() => resolve(Single.ZespConnector))
        .catch(error => {
          _globalState.setState(prev => ({...prev, ...{zespConnected: false}}));
          reject(error);
        }),
      Constants.ConnectionStartTimeout);

    // setup watchdog
    _reconnecter = setInterval(() => ZespConnector.reconnectAsync(false)
        .then(() => resolve(Single.ZespConnector))
        .catch(error => {
          console.warn(`Reconnection is failed: ${error}`);
          _globalState.setState(prev => ({...prev, ...{zespConnected: false}}));
          reject(error);
        }),
      Constants.VerifyConnectionTimeout);

    return ZespConnector;
  }),

  disconnect: () => {
    if (_reconnecter) {
      clearInterval(_reconnecter);
      _reconnecter = null;
    }
    _server = null;
    _globalState.setState(prev => ({...prev, ...{zespConnected: false}}));

    try {
      if (_ws?.underlyingWebsocket?.readyState === 3 || _ws?.underlyingWebsocket?.readyState == null) {
        console.debug("zesp connection already closed");
        return;
      } else if (_ws?.underlyingWebsocket?.readyState === 1) {
        console.debug("zesp connection closing...");
        _ws.close(1000); // closed normal
        return;
      } else {
        _ws?.close(1000); // closed normal
      }
    } catch {
      //it's ok (;
    }
  },

  reconnectAsync: (force) => new Promise<void>((resolve, reject) => {
    if (!_globalState) {
      reject("ZespConnector is not initialized yet");
      // throw new Error("ZespConnector is not initialized yet")
    }

    if (!_server) {
      reject("Server configuration missed");
      // throw new Error("ZespConnector is not initialized yet")
    }

    if (_ws?.underlyingWebsocket?.readyState === 0) {
      reject("Already connecting");
      return;
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
    const protocol = document.location.protocol === "https:" ? "wss" : "ws";
    _ws = new WebsocketBuilder(`${protocol}://${_server!.address}:81`)
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
