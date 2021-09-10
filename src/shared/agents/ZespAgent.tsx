import React, {Fragment} from "react";
import {Single} from "../../services/single";
import ServiceDevices from "../../services/zesp/service-devices";
import ServiceUpdates from "../../services/zesp/service-report-updates";
import ServiceRoot from "../../services/zesp/service-root";
import {IServerInfo} from "../../pages/welcome/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {setConnected, setDisconnected, getStatus, setInitialized} from "store/slices/zespSlice";
import {setDevices, updateReport, updateRootReports} from "store/slices/devicesSlice";
import {IZespConnector} from "../../services/zesp/interfaces/IZespConnector";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";

interface IProps {
  server: IServerInfo
}

export const ZespAgent = (props: IProps) => {
  const dispatch = useDispatch();
  const zespStatus = useSelector(getStatus);

  if (zespStatus === "connected") {
    return (<Fragment/>);
  }

  Single.ZespConnector
    .connectAsync(props.server, (status) => dispatch(status ? setConnected() : setDisconnected()))

    .then(zesp => new Promise<IZespConnector>((resolve, reject) => {
      ServiceDevices.getDevicesListAsync(zesp)
        .then(devices => {
          dispatch(setDevices(devices));
          resolve(zesp);
        })
        .catch(reason => reject(reason));
    }))

    .then(zesp => new Promise<IZespConnector>((resolve, reject) => {
      ServiceRoot
        .getRootDataAsync(zesp)
        .then(reports => {
          dispatch(updateRootReports(reports))
          resolve(zesp);
          console.debug("Root device reports updated");
        })
        .catch(reason => reject(reason));
    }))

    .then(zesp => {
      const onReport = (ieee: string, reportKey: string, update: Partial<ZespReportInfo>) => {
        dispatch(updateReport({ieee, reportKey, update}));
      };

      ServiceUpdates.subscribeToEvents(zesp, onReport);
    })
    .then(() => dispatch(setInitialized(true)))
    .catch(reason => console.error(reason))
    .finally(() => console.debug("ZESP initialization completed"));

  return (<Fragment/>);
}
