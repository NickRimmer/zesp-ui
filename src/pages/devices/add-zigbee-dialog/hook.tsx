import {useContext, useEffect, useRef, useState} from "react";
import "./styles.scss";
import {ZespContext} from "../../../shared/agents/ZespAgent";
import {TypedZespResponseValidator} from "../../../services/zesp/common/ZespResponseValidators";
import {ZespConnectorListener} from "../../../services/zesp/common/service-connector.interfaces";
import {ZespDataEvent} from "../../../services/zesp/common/ZespDataEvent";

export default () => {
  const {zespSend, subscribe, unsubscribe} = useContext(ZespContext)
  const [logs, setLogs] = useState("")
  const logRef = useRef(logs)
  const [isCompleted, setIsCompleted] = useState(false)
  const isCompletedRef = useRef(isCompleted);
  const joinListenerRef = useRef<ZespConnectorListener>()
  const allDevListenerRef = useRef<ZespConnectorListener>()

  useEffect(() => {
    console.debug("start pairing...");
    joinListenerRef.current = subscribe(TypedZespResponseValidator("join"), onJoinReceivedHandler);
    allDevListenerRef.current = subscribe(TypedZespResponseValidator("alldev"), onAllDevReceivedHandler)
    zespSend({data: "addDevice"});

    return () => {
      stopPairing()
      stopListening()
    }
  }, []);

  const stopPairing = (): void => {
    if (!isCompletedRef.current) {
      console.debug("stop pairing")
      zespSend({data: "addDeviceDone"})
    }
  }

  const stopListening = (): void => {
    if (joinListenerRef.current) {
      unsubscribe(joinListenerRef.current)
      joinListenerRef.current = undefined
    }

    if (allDevListenerRef.current) {
      unsubscribe(allDevListenerRef.current)
      allDevListenerRef.current = undefined
    }
  }

  const onJoinReceivedHandler = (event: ZespDataEvent): void => {
    let message = event.dataParts[0];
    if (message.includes(": timeout")) message = `<div class="warning">${message}</div>`;

    const messages = logRef.current + message;
    logRef.current = messages;
    setLogs(messages);
  }

  const onAllDevReceivedHandler = (event: ZespDataEvent): void => {
    stopPairing();

    setIsCompleted(true);
    isCompletedRef.current = true;
  }

  return {
    logs,
    isCompleted,
  }
}