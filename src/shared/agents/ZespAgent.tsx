import React, {Fragment, useContext} from "react";
import {IServerInfo} from "../../pages/welcome/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {getStatus, setInitialized} from "store/slices/zespSlice";
import useZespAgent from "./ZespAgent.hook";
import ZespConnectorImplementation from "../../services/zesp/common/ZespConnector";
import {IZespConnector} from "../../services/zesp/interfaces/IZespConnector";

interface IProps {
  server: IServerInfo
}

export const ZespContext = React.createContext<IZespConnector>(ZespConnectorImplementation);

export const ZespAgent: React.FC<IProps> = ({server, children}): React.ReactElement => {
  const dispatch = useDispatch();
  const zespStatus = useSelector(getStatus);
  const zesp = useContext(ZespContext);
  const {
    connectAsync,
    getDevices,
    getRoot,
    readUiSettings,
    readFirmwareUpdates,
    subscribeReportUpdates,
  } = useZespAgent(dispatch);

  if (zespStatus === "connected") return (
    <ZespContext.Provider value={ZespConnectorImplementation}>
      {children}
    </ZespContext.Provider>
  );

  if (zespStatus !== "disconnected") return (<Fragment/>);

  connectAsync(server, zesp)
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