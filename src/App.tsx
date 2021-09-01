import React, {Fragment, useEffect, useRef} from 'react';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import './bootstrap-updates.scss';
import './App.scss';
import TopMenu from "./shared/top-menu";
import LoadingSpinner from "./shared/loading-spinner";
import {GlobalStateProvider, useGlobalState} from "./shared/global-state-provider";
import {Single} from "./services/single";
import toast, {Toaster} from "react-hot-toast";
import {Routes} from "./Routes";
import {WelcomePage} from "./pages/welcome";
import {useLocalStorage} from "./services/localStorage";
import {IServerInfo} from "./pages/welcome/interfaces";
import ZespGeneralService from "./services/zesp/service-general";

const Content = () => {
  const globalState = useGlobalState();
  const [servers] = useLocalStorage<IServerInfo[]>("servers", []);
  const selectedServer = (
    globalState.state.selectedServerIndex === null || servers.length <= globalState.state.selectedServerIndex!
      ? null
      : servers[globalState.state.selectedServerIndex!]
  );

  return selectedServer ? (<App server={selectedServer}/>) : (<WelcomePage/>);
}

const App = (props: { server: IServerInfo }) => {
  const globalState = useGlobalState();
  const globalStateRef = useRef(globalState);

  useEffect(() => {
    globalStateRef.current = globalState;
  }, [globalState]);

  useEffect(() => {
    Single.Spinner.init(globalState);
    Single.Spinner.show();

    Single.ZespConnectorPromise
      .then(zesp => zesp.connectAsync(() => globalStateRef.current, props.server))
      .then(() => ZespGeneralService.initAsync(() => globalStateRef.current))
      .then(() => {
        globalState.setState(prev => ({...prev, ...{appInitialized: true}}))
        Single.Spinner.hide();
      })
      .catch(error => {
        globalState.setState(prev => ({
          ...prev, ...{
            appInitialized: false,
            selectedServerIndex: null,
          }
        }))
        Single.ZespConnector.disconnect();
        Single.Spinner.hide();

        toast.error(`Ooops, cannot connect to the server (${props.server.address}). ${error}`); //TODO localization
      });
  }, []);

  if (!globalState.state.appInitialized) {
    return (<Fragment/>);
  }

  return (
    <div className="container-md d-flex w-100 h-100 p-3 mx-auto flex-column">
      <header className="masthead">
        <a href="/"><h3 className="masthead-brand">ZESP:UI</h3></a>
        <TopMenu/>
      </header>
      <main role="main" className="text-start d-flex flex-grow-1 flex-column">
        <Routes/>
      </main>
      <footer className="mastfoot mt-3">
        <p>ZESP UI application, by <a href="https://t.me/NickRimmer" target={"_blank"} rel="noreferrer">@NickRimmer</a>. (0.0.0 version, <span>dev build</span>)
        </p>
      </footer>
    </div>
  )
}

const Result = () => {
  return (
    <Router>
      <Switch>
        <GlobalStateProvider>
          <Content/>
          <LoadingSpinner/>
          <Toaster/>
        </GlobalStateProvider>
      </Switch>
    </Router>
  );
}

export default Result;
