import React, {Fragment, useRef} from "react";
import {Single} from "../../services/single";
import ServiceDevices from "../../services/zesp/service-devices";
import ServiceUpdates from "../../services/zesp/service-report-updates";
import ServiceRoot from "../../services/zesp/service-root";
import ServiceFirmware from "../../services/zesp/service-firmware";
import ServiceSettings from "../../services/zesp/service-settings";
import {IServerInfo} from "../../pages/welcome/interfaces";
import {useDispatch, useSelector} from "react-redux";
import {setConnected, setDisconnected, getStatus, setInitialized} from "store/slices/zespSlice";
import {setDevices, updateReport, updateRootReports} from "store/slices/devicesSlice";
import {setZespFirmwareInstalledVersion, setZespFirmwareUpdate} from "store/slices/zespFirmwareSlice";
import {IZespConnector} from "../../services/zesp/interfaces/IZespConnector";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {UiDefaultSettings, UiSettings} from "../../models/UiSettings";
import {getUiSettings, setUiSettings} from "../../store/slices/settingsSlice";

interface IProps {
  server: IServerInfo
}

export const ZespAgent = (props: IProps) => {
  const dispatch = useDispatch();
  const zespStatus = useSelector(getStatus);
  const uiSettingsRef = useRef<UiSettings>();

  if (zespStatus === "connected") {
    return (<Fragment/>);
  }

  Single.ZespConnector
    .connectAsync(props.server, (status) => dispatch(status ? setConnected() : setDisconnected()))

    // read devices list
    .then(zesp => new Promise<IZespConnector>((resolve, reject) => {
      ServiceDevices.getDevicesListAsync(zesp)
        .then(result => {
          dispatch(setDevices(result.devices));
          if (result.zespVersion) dispatch(setZespFirmwareInstalledVersion(result.zespVersion));

          resolve(zesp);
        })
        .catch(reason => reject(reason));
    }))

    // read root device information
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

    // read ui settings
    .then(zesp => ServiceSettings
      .getCustomAsync<UiSettings>("zesp_ui")
      .then(settings => {
        dispatch(setUiSettings(settings || UiDefaultSettings))
        uiSettingsRef.current = settings || UiDefaultSettings;
        return zesp;
      }))

    // read firmware updates
    .then(zesp => {
      const uiSettings = uiSettingsRef.current
      if (!uiSettings) throw new Error("Read UI settings before firmware checking");

      const oneDataMs = 1000 * 60 * 60 * 24;
      if (uiSettings.firmwareUpdate && uiSettings.firmwareLastCheck && (Date.now() - uiSettings.firmwareLastCheck) < oneDataMs) {
        dispatch(setZespFirmwareUpdate(uiSettings.firmwareUpdate));
        console.debug("Firmware information read from settings");
        return zesp;
      }

      ServiceFirmware
        .getFirmwareInfoAsync(zesp)
        .then(firmwareInfo => {
          dispatch(setZespFirmwareInstalledVersion(firmwareInfo.currentVersion));
          dispatch(setZespFirmwareUpdate(firmwareInfo.updatesInformation));

          uiSettingsRef.current = {...uiSettings, ...{firmwareUpdate: firmwareInfo.updatesInformation, firmwareLastCheck: Date.now()}};
          ServiceSettings.setCustom("zesp_ui", uiSettingsRef.current);

          dispatch(setUiSettings(uiSettingsRef.current));
          console.debug("Firmware updates information loaded");
        })
        .catch(reason => {
          console.warn("Cannot read Firmware update information");
          console.warn(reason);
        });

      // continue without waiting of results
      return zesp;
    })

    // subscribe for report updates
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
