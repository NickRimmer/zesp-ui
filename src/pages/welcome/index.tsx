import React, {FunctionComponent, useState} from "react";
import "./styles.scss";
import {IServerInfo, WelcomePageParts} from "./interfaces";
import PartItems from "./part-items";
import PartEdit from "./part-edit";
import {useLocalStorage} from "../../services/localStorage";
import {useGlobalState} from "../../shared/global-state-provider";

export const WelcomePage: FunctionComponent = () => {
  const globalState = useGlobalState();
  const [currentPart, setCurrentPart] = useState<WelcomePageParts>("welcome");
  const [editServer, setEditServer] = useState<IServerInfo>();
  const [servers, setServers] = useLocalStorage<IServerInfo[]>("servers", []);

  // const servers: IServerInfo[] = [];

  const backToWelcomeAction = () => {
    setEditServer(undefined);
    setCurrentPart("welcome");
  }

  const openAddAction = () => {
    setEditServer(undefined);
    setCurrentPart("edit");
  }

  const openEditAction = (server: IServerInfo) => {
    setEditServer(server);
    setCurrentPart("edit");
  }

  const addAction = (server: IServerInfo) => {
    servers.push(server)
    setServers(servers);
    backToWelcomeAction();
  }

  const updateAction = (server: IServerInfo) => {
    const index = servers.indexOf(editServer!);
    servers[index] = server;
    setServers(servers);

    console.log(servers);
    backToWelcomeAction();
  }

  const deleteAction = () => {
    setServers(servers.filter(server => server !== editServer));
    backToWelcomeAction();
  };

  const openServerAction = (index: number) => {
    // const selectedServer = servers[index];
    // console.log(selectedServer);
    // console.log(index);
    globalState.setState(prev => ({...prev, ...{selectedServerIndex: index}}));
  }

  if (currentPart === "edit") return (
    <PartEdit editServer={editServer} addAction={addAction} updateAction={updateAction} closeAction={backToWelcomeAction} deleteAction={deleteAction}/>);
  return (<PartItems servers={servers} openAddServer={openAddAction} openEditAction={openEditAction} openServerAction={openServerAction}/>);
}