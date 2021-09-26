import React, {useState} from 'react';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import './bootstrap-updates.scss';
import './App.scss';
import LoadingSpinner from "./shared/loading-spinner";
import {Toaster} from "react-hot-toast";
import {Routes} from "./Routes";
import {WelcomePage} from "./pages/welcome";
import {IServerInfo} from "./pages/welcome/interfaces";
import {ZespAgent} from "./shared/agents/ZespAgent";
import {AppFooter} from "./shared/footer";
import AppHeader from "./shared/header";

const Content = () => {
  const selfHosted = process.env.REACT_APP_SELF_HOSTED === "1"
  if (selfHosted) {
    const selfHostedServer: IServerInfo = {
      address: process.env.REACT_APP_SELF_HOSTED_DEV || document.location.hostname,
      name: "Self-hosted"
    }

    return <App server={selfHostedServer}/>
  }


  const [serverIndex, setServerIndex] = useState<number | null>(null);
  const serversString = window.localStorage.getItem("servers");
  const servers = (serversString && JSON.parse(serversString)) || [];
  const selectedServer = (serverIndex === null || servers.length <= serverIndex!)
    ? null
    : servers[serverIndex!];


  return selectedServer ? (<App server={selectedServer}/>) : (<WelcomePage setServerIndex={setServerIndex}/>);
}

const App = (props: { server: IServerInfo }) => {
  return (
    <ZespAgent server={props.server}>
      <div className="container-md d-flex w-100 h-100 p-3 mx-auto flex-column">
        <AppHeader/>
        <main role="main" className="text-start d-flex flex-grow-1 flex-column">
          <Routes/>
        </main>
        <AppFooter/>
      </div>
    </ZespAgent>
  )
}

const Result = () => {
  return (
    <>
      <Router>
        <Switch>
          <Content/>
        </Switch>
      </Router>

      <LoadingSpinner/>
      <Toaster/>
    </>
  );
}

export default Result;
