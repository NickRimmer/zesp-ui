import React, {Fragment, useContext, useEffect, useRef, useState} from "react";
import {IServerInfo} from "../../pages/welcome/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {getStatus, setConnectionStatus, setInitialized} from "store/slices/zespSlice";
import useZespAgent from "./ZespAgent.hook";
import useZespConnector from "../../services/zesp/common/service-connector";
import Constants from "../../services/zesp/common/Constants";
import {IZespConnector} from "../../services/zesp/common/service-connector.interfaces";

interface IProps {
  server: IServerInfo
}

export const ZespContext = React.createContext<IZespConnector>(useZespConnector());

export const ZespAgent: React.FC<IProps> = ({server, children})
  : React.ReactElement => {
  const dispatch = useDispatch();
  const zespStatus = useSelector(getStatus);
  const [zesp, setZesp] = useState(useContext(ZespContext));
  const _restartTimerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  useEffect(() => {
    if (zespStatus === "reconnect") {
      setZesp(useZespConnector());
      dispatch(setConnectionStatus("disconnected"));
    }

    console.log(`ZESP agent status: ${zespStatus}`);
  }, [zespStatus])

  const {
    connectAsync,
    getDevices,
    getRoot,
    readUiSettings,
    readFirmwareUpdates,
    subscribeReportUpdates,
  } = useZespAgent(dispatch, zesp);

  if (zespStatus === "connected") return (
    <ZespContext.Provider value={zesp}>
      {children}
    </ZespContext.Provider>
  );

  if (zespStatus === "closed") {
    if (_restartTimerRef.current) {
      clearTimeout(_restartTimerRef.current);
      _restartTimerRef.current = undefined;
    }

    _restartTimerRef.current = setTimeout(() => {
      if (zespStatus === "closed") {
        dispatch(setConnectionStatus("reconnect"));
      } else {
        console.debug(`Cancel restarting, cause status: ${zespStatus}`);
      }
    }, Constants.RestartConnectionTimeout);
  }

  if (zespStatus !== "disconnected") return (<Fragment/>);
  dispatch(setConnectionStatus("connecting"));
  connectAsync(server)
    .then(getDevices)
    .then(getRoot)
    .then(readUiSettings)
    .then(readFirmwareUpdates)
    .then(subscribeReportUpdates)

    // final steps
    .then(() => dispatch(setInitialized(true)))
    .catch(reason => console.error(reason))
    .finally(() => {
      setZesp(zesp);
      console.debug("ZESP initialization completed");
    });

  return (<Fragment/>);
}
