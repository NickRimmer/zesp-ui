import React, {Fragment} from "react";
import {IServerInfo} from "../../pages/welcome/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {getStatus, setInitialized} from "store/slices/zespSlice";
import useZespAgent from "./ZespAgent.hook";

interface IProps {
  server: IServerInfo
}

export const ZespAgent = (props: IProps) => {
  const dispatch = useDispatch();
  const zespStatus = useSelector(getStatus);
  const {
    connectAsync,
    getDevices,
    getRoot,
    readUiSettings,
    readFirmwareUpdates,
    subscribeReportUpdates,
  } = useZespAgent(dispatch);

  if (zespStatus === "connected") return (<Fragment/>);

  connectAsync(props.server)
    .then(getDevices)
    .then(getRoot)
    .then(readUiSettings)
    .then(readFirmwareUpdates)
    .then(subscribeReportUpdates)

    // final steps
    .then(() => dispatch(setInitialized(true)))
    .catch(reason => console.error(reason))
    .finally(() => console.debug("ZESP initialization completed"));

  return (<Fragment/>);
}