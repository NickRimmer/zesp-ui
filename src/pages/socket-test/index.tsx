import React, {useEffect, useRef, useState} from "react";
import {FadeIn} from "../../shared/fadein-transition";
import {Button, Card} from "react-bootstrap";
import {ReactForm} from "../../shared/form/react-form";
import {Single} from "../../services/single";
import {AllMessagesZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";

const maxMessagesCount = 15;
const predefinedMessages = ["getDeviceList", "get_Mi_lamp", "LoadJson|/location.json", "LoadJson|/groups.json"];
const predefinedBinary = ["01 0000 01 0100", "01 0000 01 0000"];

interface IFormData {
  messageToSend?: string,
}

export default () => {
  const [messages, _setMessages] = useState<string[]>([]);
  const [messageSendValue, setMessageSendValue] = useState<string>("");
  const [paused, _setPaused] = useState<boolean>(false);

  const messagesRef = useRef(messages);
  const pausedRef = useRef(paused);

  const addMessages = (message: string) => {
    if (pausedRef.current) return;

    const data: string[] = [message.substr(0, 250), ...messagesRef.current];
    const cutCount = data.length - maxMessagesCount;
    if (cutCount > 0) data.splice(data.length - cutCount, cutCount)

    messagesRef.current = data;
    _setMessages(data);
  }

  const togglePause = () => {
    const data = !pausedRef.current;
    pausedRef.current = data;
    _setPaused(data);
  }

  const onSend = (data: IFormData) => {
    if (!data.messageToSend) return;
    addMessages(`>${data.messageToSend}`);
    Single.ZespConnector.send({data: data.messageToSend});
  }

  const onSendPredefined = (event: React.MouseEvent): void => {
    const el = event.target as HTMLButtonElement;
    const data = el.innerText;
    setMessageSendValue(data);
  }

  const onSendBinary = (message?: string | null): void => {
    const data = message || messageSendValue;
    Single.ZespConnector.send({data: data, isBinary: true});

    // const dataHex = data.match(/[\da-f]{2}/gi)?.map(group => parseInt(group, 16)) as ArrayLike<number>;
    // const dataToSend = new Uint8Array(dataHex);
    //
    // addMessages(`>bin: ${data} (${dataToSend})`);
    // Single.ZespConnector.send(dataToSend);
  }

  const onClearLog = () => {
    messagesRef.current = [];
    _setMessages([]);
  }

  useEffect(() => {
    const listener = Single.ZespConnector.subscribe(AllMessagesZespResponseValidator, (event) => {
      const message = event.response;
      addMessages(message);
    });
    return () => Single.ZespConnector.unsubscribe(listener);
  }, []);

  return (

    <FadeIn>
      <ReactForm onSubmit={onSend}>
        <Card>
          <Card.Header>WebSocket tester (FOR DEVELOPMENT ONLY)</Card.Header>
          <Card.Body>
            <div className="row mb-2">
              <label className="col-md-3 col-lg-2">Message to send</label>
              <div className="col">
                <input type="text" className="form-control" id="messageToSend" value={messageSendValue} onChange={event => setMessageSendValue(event.target.value)}/>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-lg-2"/>
              <div className="col">
                <div>
                  {predefinedMessages.map((x, i) => (
                    <button key={i} type="submit" className="btn btn-sm btn-outline-primary me-1" onClick={onSendPredefined}>{x}</button>
                  ))}
                </div>
                <div className="mt-1">
                  {predefinedBinary.map((x, i) => (
                    <button key={i} type="button" className="btn btn-sm btn-outline-secondary me-1" onClick={() => {
                      setMessageSendValue(x);
                      onSendBinary(x);
                    }}>{x}</button>
                  ))}
                </div>
              </div>
            </div>
          </Card.Body>
          <Card.Footer>
            <Button variant="primary" type="submit">Send message</Button>
            <Button variant="secondary" type="button" onClick={() => onSendBinary()} className="ms-2">Send binary</Button>
          </Card.Footer>
        </Card>
      </ReactForm>

      <Card className="mt-4">
        <Card.Header>
          <span>Communication log <span className="badge bg-secondary small">{messages.length}</span></span>
          <button className="btn btn-outline-secondary ms-3 btn-sm" onClick={onClearLog}>Clear log</button>
          <button className="btn btn-outline-secondary ms-3 btn-sm" onClick={() => togglePause()}>{paused ? "Start logs" : "Pause logs"}</button>
        </Card.Header>
        <Card.Body>
          {messages.map((message, i) => message.startsWith(">")
            ? (<div key={i} className="px-2 mb-3 py-1 m-1 bg-success bg-opacity-25 rounded">{message.substr(1)}</div>)
            : (<div key={i} className="border-start mb-3 border-3 border-warning p-0 d-flex flex-wrap">{message.split("|").map((x, i2) => (
              <span key={i2} className="bg-warning bg-opacity-25 m-1 px-2 rounded">{x}</span>
            ))}</div>))}
        </Card.Body>
      </Card>
    </FadeIn>
  );
}