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

  // const setZespConnected: ZespConnectedAction = (state) => globalState.setState(x => ({...x, ...{zespConnected: state}}));
  // const setDevices: UpdateDevicesAction = (devices) => globalState.setState(x => ({...x, ...{devices: devices}}));
  // const getRootDevice: GetCurrentDeviceAction = () => devices?.find(x => x.zespInfo.ModelId === "ZESP_Root")
  // const getDevice: GetDeviceAction = (ieee) => devices?.find(x => x.zespInfo.IEEE === ieee);
  // const getDevice: GetDeviceAction = (ieee): DeviceInfo => Single.DevicesState(ieee)[0];
  // const getDevice: GetDeviceAction = (ieee) => useSelector((state: RootState) => getDevice2(state, ieee));
  // const updateDevices: UpdateDevicesAction = (devicesToUpdate) => {
  //   // const deviceIee = devicesToUpdate.map(x => x.zespInfo.IEEE);
  //   // const current = (devices || []).filter(y => deviceIee.indexOf(y.zespInfo.IEEE) == -1);
  //   // const updated = [...current, ...devicesToUpdate];
  //   //
  //   // setDevices(updated);
  //
  //   devicesToUpdate.forEach(device => {
  //     // const [, setDevice] = Single.DevicesState(device.zespInfo.IEEE);
  //     // setDevice(device);
  //
  //     //   const exists = devices.findIndex(x => x.zespInfo.IEEE === device.zespInfo.IEEE);
  //     //   if (exists === -1) {
  //     //     devices.push(device);
  //     //     return;
  //     //   }
  //     //
  //     //   console.log(`Update device at ${exists}`);
  //     //   devices[exists] = device
  //     // })
  //     //
  //     // setDevices(devices);
  //   });
  // }

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

  // .then(() => {
  //   ServiceReportUpdates.subscribeToEvents(Single.ZespConnector, (ieee, reportKey, update) => {
  //     console.log(`Update received for '${ieee}' key '${reportKey}'`);
  //     console.log(update);
  //
  //     const device = getDevice(ieee);
  //     console.log(device);
  //   });
  // });

  // useEffect(() => {
  //   console.debug(`Initialization step: ${step}`);
  //
  //   if (step === "hello") {
  //     // Single.Spinner.init(globalState);
  //     // Single.Spinner.show();
  //
  //     Single.ZespConnector
  //       // .connectAsync(props.server, setZespConnected)
  //       .connectAsync(props.server, (status) => dispatch(status ? setConnected() : setDisconnected()))
  //       .then(() => ServiceDevices.getDevicesList(Single.ZespConnector, (devices) => {
  //         console.log(devices);
  //         dispatch(setDevices(devices));
  //       }))
  //       .then(() => {
  //         ServiceReportUpdates.subscribeToEvents(Single.ZespConnector, (ieee, reportKey, update) => {
  //           console.log(`Update received for '${ieee}' key '${reportKey}'`);
  //           console.log(update);
  //
  //           const device = getDevice(ieee);
  //           console.log(device);
  //         });
  //       })
  //       // .then(() => setStep("getDevices"));
  //       .then(() => setStep("finish"))
  //       .catch(() => setStep("error"));
  //
  //     return;
  //   }
  //
  //   if (step === "getDevices") {
  //     if (step !== "getDevices") return;
  //     ServiceDevices
  //       // .getDevicesList(Single.ZespConnector, setDevices)
  //       .getDevicesList(Single.ZespConnector, updateDevices)
  //       .then(() => setStep("getRoot"));
  //
  //     return;
  //   }
  //
  //   if (step === "getRoot") {
  //     // ServiceRoot
  //     //   .getRootData(Single.ZespConnector, getRootDevice, updateDevices)
  //     //   .then(() => setStep("getUpdates"))
  //
  //     setStep("getUpdates")
  //     return;
  //   }
  //
  //   if (step === "getUpdates") {
  //     // ServiceReportUpdates.subscribeToEvents(Single.ZespConnector, (ieee, reportKey, update)=>{
  //     //  
  //     // });
  //     setStep("finish")
  //     return;
  //   }
  //
  //   if (step === "finish") {
  //     // Single.Spinner.hide();
  //     // setInterval(() => console.log(globalState.state), 2000);
  //     // globalState.setState(prev => ({...prev, ...{appInitialized: true}}));
  //   }
  // }, [step]);

  return (<Fragment/>);
}
