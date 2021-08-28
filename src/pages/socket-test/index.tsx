import React, {useEffect, useRef, useState} from "react";
import {FadeIn} from "../../shared/fadein-transition";
import {Button, Card} from "react-bootstrap";
import {ReactForm} from "../../shared/form/react-form";
import {InputGroupHorizontal} from "../../shared/form";
import {Single} from "../../services/single";
import {AllMessagesZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";

const maxMessagesCount = 15;

interface IFormData {
  messageToSend?: string,
}

export default () => {
  const [messages, _setMessages] = useState<string[]>([]);
  const [messageSendDefValue, setMessageSendDefValue] = useState<string>("");

  const messagesRef = useRef(messages);
  const predefined = ["getDeviceList", "get_Mi_lamp", "LoadJson|/location.json", "LoadJson|/groups.json"];

  const addMessages = (message: string) => {
    const data: string[] = [message.substr(0, 250), ...messagesRef.current];
    const cutCount = data.length - maxMessagesCount;
    if (cutCount > 0) data.splice(data.length - cutCount, cutCount)

    messagesRef.current = data;
    _setMessages(data);
  }

  const onSend = (data: IFormData) => {
    if (!data.messageToSend) return;
    addMessages(`>${data.messageToSend}`);
    Single.ZespConnector.send(data.messageToSend);
  }

  const onSendPredefined = (event: React.MouseEvent): void => {
    const el = event.target as HTMLButtonElement;
    const data = el.innerText;
    setMessageSendDefValue(data);
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
          <Card.Header>WebSocket tester</Card.Header>
          <Card.Body>
            <InputGroupHorizontal defaultValue={messageSendDefValue} controlId="messageToSend" label="Message to send"/>
            <div className="row">
              <div className="col-md-3 col-lg-2"/>
              <div className="col">
                {predefined.map((x, i) => (
                  <button key={i} type="submit" className="btn btn-sm btn-outline-success me-1" onClick={onSendPredefined}>{x}</button>
                ))}
              </div>
            </div>
          </Card.Body>
          <Card.Footer><Button variant="primary" type="submit">Send message</Button></Card.Footer>
        </Card>
      </ReactForm>

      <Card className="mt-4">
        <Card.Header>
          <span>Communication log <span className="badge bg-secondary small">{messages.length}</span></span>
          <button className="btn btn-outline-secondary ms-3 btn-sm" onClick={onClearLog}>Clear log</button>
        </Card.Header>
        <Card.Body>
          {messages.map((message, i) => message.startsWith(">")
            ? (<div key={i} className="px-2 mb-3 py-1 m-1 bg-success bg-opacity-25 rounded">{message.substr(1)}</div>)
            : (<div key={i} className="border-start mb-3 border-3 border-warning p-0 d-flex flex-wrap">{message.split("|").map(x => (
              <span className="bg-warning bg-opacity-25 m-1 px-2 rounded">{x}</span>
            ))}</div>))}
        </Card.Body>
      </Card>
    </FadeIn>
  );
}