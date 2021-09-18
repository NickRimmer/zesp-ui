import React, {useState} from 'react';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import './bootstrap-updates.scss';
import './App.scss';
import TopMenu from "./shared/top-menu";
import LoadingSpinner from "./shared/loading-spinner";
import {Toaster} from "react-hot-toast";
import {Routes} from "./Routes";
import {WelcomePage} from "./pages/welcome";
import {IServerInfo} from "./pages/welcome/interfaces";
import {ZespAgent} from "./shared/agents/ZespAgent";
import {UpdatesNotification} from "./shared/updates-notification";
import {AppFooter} from "./shared/footer";

const Content = () => {
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
        <header className="masthead">
          <a href="/"><h3 className="masthead-brand">ZESP:UI</h3></a>
          <div className="d-flex flex-row align-items-center">
            <TopMenu/>
            <UpdatesNotification/>
          </div>
        </header>
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
