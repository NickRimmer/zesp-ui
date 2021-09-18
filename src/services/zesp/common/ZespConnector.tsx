import {Websocket, WebsocketBuilder} from "websocket-ts";
import Constants from "./Constants";
import {ZespDataEvent, ZespDataEventType} from "./ZespDataEvent";
import {IZespConnector, ZespConnectedAction, ZespConnectorHandler, ZespConnectorListener} from "../interfaces/IZespConnector";
import {CloseEventCodes} from "../enums/CloseEventCodes";
import {IZespResponseValidator} from "../interfaces/IZespResponseValidator";
import {IServerInfo} from "../../../pages/welcome/interfaces";

// const zespHost = "192.168.3.30"; //TODO read host from config

let _ws: Websocket;
let _server: IServerInfo | null;
const onMessageEvent = new EventTarget();
let _reconnecter: NodeJS.Timeout | null | undefined;

const ZespConnector: IZespConnector = {
  connectAsync: (
    server,
    zespConnectedAction: ZespConnectedAction
  ) => new Promise<IZespConnector>((resolve, reject) => {
    _server = server;

    // start with delay
    setTimeout(() => ZespConnector.zespReconnectAsync(true, zespConnectedAction)
        .then(() => {
          resolve(ZespConnector)
        })
        .catch(error => {
          zespConnectedAction(false);
          reject(error);
        }),
      Constants.ConnectionStartTimeout);

    // setup watchdog
    _reconnecter = setInterval(() => ZespConnector.zespReconnectAsync(false, zespConnectedAction)
        // .then(() => resolve(Single.ZespConnector))
        .catch(error => {
          console.warn(`Reconnection is failed: ${error}`);
          zespConnectedAction(false);
          // reject(error);
        }),
      Constants.VerifyConnectionTimeout);
  }),

  disconnect: (): void => {
    if (_reconnecter) {
      clearInterval(_reconnecter);
      _reconnecter = null;
    }

    if (_ws) {
      onMessageEvent.removeEventListener(ZespDataEventType, null);
      try {
        _ws.close(1000); // closed normal
      } catch {
        //it's ok (;
      }
    }
  },

  zespReconnectAsync: (force, zespConnectedAction) => new Promise<void>((resolve, reject) => {
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

    if (zespConnectedAction) zespConnectedAction(false);
    const protocol = document.location.protocol === "https:" ? "wss" : "ws";
    _ws = new WebsocketBuilder(`${protocol}://${_server!.address}:81`)
      .onOpen(() => {
        if (zespConnectedAction) {
          console.debug("ZESP connected");
          zespConnectedAction(true);
        }
        resolve();
      })
      .onClose(() => {
        console.debug("ZESP connection closed");
        zespConnectedAction && zespConnectedAction(false)
      })
      .onError(() => {
        onConnectionError();
        reject("ZESP connection error")
      })
      .onMessage(onMessageReceived)
      .build();
  }),

  zespSend: (args): void => {
    if (!_ws) {
      console.error("ZespConnector.send: WebSocket client is not initialized yet");
      return;
    }

    const data = args.isBinary === true
      ? getBinaryData(args.data)
      : args.data;

    _ws.send(data);
  },

  zespRequestAsync: (args) => new Promise<ZespDataEvent>(((resolve, reject) => {
    if (!args.timeoutSeconds || args.timeoutSeconds <= 0) args.timeoutSeconds = Constants.DefaultRequestTimeoutSeconds;
    if (args.isBinary !== true) args.isBinary = false;

    let responseReceived = false;
    const validator = args.responseValidator;

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
      console.warn(`zesp response did not received (timeout: ${args.timeoutSeconds} seconds)`);
      reject("timeout");
    };

    // send request
    try {
      onMessageEvent.addEventListener(ZespDataEventType, listener);
      ZespConnector.zespSend({data: args.data, isBinary: args.isBinary})
      setTimeout(onTimeout, args.timeoutSeconds * 1000);
    } catch (error) {
      reject(`exception: ${error}`);
    }
  })),

  subscribe: (validator: IZespResponseValidator, handler: ZespConnectorHandler): ZespConnectorListener => {
    const listener = (event: Event): void => {
      const zespEvent = event as ZespDataEvent;
      if (!validator.isValid(zespEvent)) return;

      handler(zespEvent);
    }

    onMessageEvent.addEventListener(ZespDataEventType, listener)
    return listener;
  },

  unsubscribe: (listener: ZespConnectorListener) => onMessageEvent.removeEventListener(ZespDataEventType, listener),

  getServerAddress: () => _server?.address
};

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

const getBinaryData = (message: string): Uint8Array => {
  const data = message.replaceAll(" ", "");
  const dataHex = data.match(/[\da-f]{2}/gi)?.map(group => parseInt(group, 16)) as ArrayLike<number>;
  return new Uint8Array(dataHex);
}

export default ZespConnector;
