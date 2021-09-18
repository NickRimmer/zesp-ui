import {Dispatch} from "redux";
import {IZespConnector} from "../../services/zesp/interfaces/IZespConnector";
import {setConnected, setDisconnected} from "../../store/slices/zespSlice";
import {IServerInfo} from "../../pages/welcome/interfaces";
import ServiceDevices from "../../services/zesp/service-devices";
import {setDevices, updateReport, updateRootReports} from "../../store/slices/devicesSlice";
import {setZespFirmwareInstalledVersion, setZespFirmwareUpdate} from "../../store/slices/zespFirmwareSlice";
import ServiceRoot from "../../services/zesp/service-root";
import useZespSettings from "../../services/zesp/zespSettings.hook";
import ServiceFirmware from "../../services/zesp/service-firmware";
import {UiDefaultSettings, UiSettings} from "../../models/UiSettings";
import {setUiSettings} from "../../store/slices/settingsSlice";
import {useRef} from "react";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import ServiceUpdates from "../../services/zesp/service-report-updates";

export const useZespAgent = (dispatch: Dispatch) => {
  const uiSettingsRef = useRef<UiSettings>({} as UiSettings);
  const firmwareUpdateMinTimout = 1000 * 60 * 60 * 24;

  // init
  const connectAsync = (server: IServerInfo, zesp: IZespConnector): Promise<IZespConnector> => zesp
    .connectAsync(server, (status) => dispatch(status ? setConnected() : setDisconnected()))

  // read devices list
  const getDevices = (zesp: IZespConnector): Promise<IZespConnector> => ServiceDevices.getDevicesListAsync(zesp)
    .then(result => {
      dispatch(setDevices(result.devices));
      if (result.zespVersion) dispatch(setZespFirmwareInstalledVersion(result.zespVersion));
    })
    .then(() => zesp);

  // read root info
  const getRoot = (zesp: IZespConnector): Promise<IZespConnector> => ServiceRoot
    .getRootDataAsync(zesp)
    .then(reports => {
      dispatch(updateRootReports(reports))
      console.debug("Root device reports updated");
    })
    .then(() => zesp);

  // read ui settings
  const readUiSettings = (zesp: IZespConnector): Promise<IZespConnector> => useZespSettings(zesp)
    .getCustomAsync<UiSettings>("zesp_ui")
    .then(settings => {
      const result = settings || UiDefaultSettings;
      dispatch(setUiSettings(result))
      uiSettingsRef.current = result;
      return zesp;
    })

  // private firmware updates downloading
  const _getFirmware = (zesp: IZespConnector): void => {
    ServiceFirmware
      .getFirmwareInfoAsync(zesp)
      .then(firmwareInfo => {
        dispatch(setZespFirmwareInstalledVersion(firmwareInfo.currentVersion));
        dispatch(setZespFirmwareUpdate(firmwareInfo.updatesInformation));

        uiSettingsRef.current = {...uiSettingsRef.current, ...{firmwareUpdate: firmwareInfo.updatesInformation, firmwareLastCheck: Date.now()}};
        useZespSettings(zesp).setCustom("zesp_ui", uiSettingsRef.current);

        dispatch(setUiSettings(uiSettingsRef.current));
        console.debug("Firmware updates information loaded");
      })
      .catch(reason => {
        console.warn("Cannot read Firmware update information");
        console.warn(reason);
      });
  }

  // read firmware updates
  const readFirmwareUpdates = (zesp: IZespConnector): Promise<IZespConnector> => {
    const uiSettings = uiSettingsRef.current
    if (!uiSettings) throw new Error("Read UI settings before firmware checking");

    if (uiSettings.firmwareUpdate && uiSettings.firmwareLastCheck && (Date.now() - uiSettings.firmwareLastCheck) < firmwareUpdateMinTimout) {
      dispatch(setZespFirmwareUpdate(uiSettings.firmwareUpdate));
      console.debug("Firmware information read from settings");
      return Promise.resolve(zesp);
    }

    // run firmware loading in background
    _getFirmware(zesp);

    return Promise.resolve(zesp);
  }

  // subscribe to report updates events
  const subscribeReportUpdates = (zesp: IZespConnector): Promise<IZespConnector> => {
    const onReport = (ieee: string, reportKey: string, update: Partial<ZespReportInfo>) =>
      dispatch(updateReport({ieee, reportKey, update}));

    ServiceUpdates.subscribeToEvents(zesp, onReport);
    return Promise.resolve(zesp);
  }

  return {
    connectAsync,
    getDevices,
    getRoot,
    readUiSettings,
    readFirmwareUpdates,
    subscribeReportUpdates,
  }
}

export default useZespAgent;