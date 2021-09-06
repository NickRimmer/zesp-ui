import React, {Fragment} from "react";
import {useGlobalState} from "../global-state-provider";
import {useEffect, useState} from "react";
import {ZespConnectedAction} from "../../services/zesp/interfaces/IZespConnector";
import {UpdateDevicesAction} from "../../services/zesp/interfaces/UpdateDevicesAction";
import {GetCurrentDeviceAction, GetDeviceAction} from "../../services/zesp/interfaces/GetDeviceAction";
import {Single} from "../../services/single";
import ServiceDevices from "../../services/zesp/service-devices";
import ServiceRoot from "../../services/zesp/service-root";
import ServiceReportUpdates from "../../services/zesp/service-report-updates";
import {IServerInfo} from "../../pages/welcome/interfaces";

interface IProps {
  server: IServerInfo
}

export const ZespAgent = (props: IProps) => {
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
    console.debug(`Initialization step: ${step}`);

    if (step === "hello") {
      // Single.Spinner.init(globalState);
      // Single.Spinner.show();

      Single.ZespConnector
        .connectAsync(props.server, setZespConnected)
        .then(() => setStep("getDevices"));

      return;
    }

    if (step === "getDevices") {
      if (step !== "getDevices") return;
      ServiceDevices
        .getDevicesList(Single.ZespConnector, setDevices)
        .then(() => setStep("getRoot"));

      return;
    }

    if (step === "getRoot") {
      ServiceRoot
        .getRootData(Single.ZespConnector, getRootDevice, updateDevices)
        .then(() => setStep("getUpdates"))

      return;
    }

    if (step === "getUpdates") {
      ServiceReportUpdates.subscribeToEvents(Single.ZespConnector, getDevice, updateDevices)
      setStep("finish")

      return;
    }

    if (step === "finish") {
      // Single.Spinner.hide();
      // setInterval(() => console.log(globalState.state), 2000);
      globalState.setState(prev => ({...prev, ...{appInitialized: true}}));
    }
  }, [step]);

  return (<Fragment/>);
}