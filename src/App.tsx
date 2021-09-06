import React, {Fragment, useEffect, useState} from 'react';
import {BrowserRouter as Router, Switch} from "react-router-dom";
import './bootstrap-updates.scss';
import './App.scss';
import TopMenu from "./shared/top-menu";
import LoadingSpinner from "./shared/loading-spinner";
import {GlobalStateProvider, useGlobalState} from "./shared/global-state-provider";
import {Single} from "./services/single";
import {Toaster} from "react-hot-toast";
import {Routes} from "./Routes";
import {WelcomePage} from "./pages/welcome";
import {useLocalStorage} from "./services/localStorage";
import {IServerInfo} from "./pages/welcome/interfaces";
import ServiceDevices from "./services/zesp/service-devices";
import {ZespConnectedAction} from "./services/zesp/interfaces/IZespConnector";
import ServiceRoot from "./services/zesp/service-root";
import {UpdateDevicesAction} from "./services/zesp/interfaces/UpdateDevicesAction";
import {GetCurrentDeviceAction, GetDeviceAction} from "./services/zesp/interfaces/GetDeviceAction";
import ServiceReportUpdates from "./services/zesp/service-report-updates";

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
  const [step, setStep] = useState("hello");

  const setZespConnected: ZespConnectedAction = (state) => globalState.setState(x => ({...x, ...{zespConnected: state}}));
  const setDevices: UpdateDevicesAction = (devices) => globalState.setState(x => ({...x, ...{devices: devices}}));
  const getRootDevice: GetCurrentDeviceAction = () => globalState.state.devices?.find(x => x.zespInfo.ModelId === "ZESP_Root")
  const getDevice: GetDeviceAction = (ieee) => globalState.state.devices?.find(x => x.zespInfo.IEEE === ieee);

  const updateDevices: UpdateDevicesAction = (devices) => {
    globalState.setState(x => {
      const deviceIee = devices.map(x => x.zespInfo.IEEE);
      const current = (x.devices || []).filter(y => deviceIee.indexOf(y.zespInfo.IEEE) == -1);
      const updated = [...current, ...devices];

      return ({...x, ...{devices: updated}});
    });
  }

  useEffect(() => {
    Single.Spinner.init(globalState);
    Single.Spinner.show();

    Single.ZespConnector
      .connectAsync(props.server, setZespConnected)
      .then(() => setStep("getDevices"));
  }, []);

  useEffect(() => {
    if (step !== "getDevices") return;
    ServiceDevices
      .getDevicesList(Single.ZespConnector, setDevices)
      .then(() => setStep("getRoot"));
  }, [step]);

  useEffect(() => {
    if (step !== "getRoot") return;
    ServiceRoot
      .getRootData(Single.ZespConnector, getRootDevice, updateDevices)
      .then(() => setStep("getUpdates"))
  }, [step]);

  useEffect(() => {
    if (step !== "getUpdates") return;
    ServiceReportUpdates.subscribeToEvents(Single.ZespConnector, getDevice, updateDevices)
    setStep("finish")
  }, [step]);

  useEffect(() => {
    if (step !== "finish") return;

    Single.Spinner.hide();
    // setInterval(() => console.log(globalState.state), 2000);
    globalState.setState(prev => ({...prev, ...{appInitialized: true}}));
  }, [step]);

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
