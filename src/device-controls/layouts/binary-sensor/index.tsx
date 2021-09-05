import React, {FunctionComponent} from "react";
import "./styles.scss";
import {LayoutProps} from "../../../models/LayoutProps";
import {ZespReportInfo} from "../../../services/zesp/models/ZespReportInfo";
import {IDeviceClassSettings} from "./IDeviceClassSettings";

export const reportKeysValue = ["0100060000", "0104060000"];
export const reportKeysBattery = ["010000FF02"];

const deviceClasses: { [deviceClass: string]: IDeviceClassSettings } = require("./device-classes.json");
const batteryWarningLevelPercents = 50;
const batteryValuesRange = [2.7, 3.1]; // battery values to calculate percents from 0 to 100%

export const BinarySensorLayout: FunctionComponent<LayoutProps> = (props: LayoutProps) => {
  const value = getValueSettings(props);
  const battery = getBatterySettings(props);

  return (
    <div className="row custom-binary-layout">
      <div className="col col-5 left">
        <i className={`bi ${value.iconClassName}`}/>
      </div>
      <div className="col right flex-column justify-content-center">
        <div className="text-center">
          <div>Current status:</div>
          <div className={value.valueClassName}>{value.valueTitle}</div>
        </div>

        <div className="text-center mt-3 w-100">
          <div>Battery Level: <span className={`status ${battery.stateClassName}`}>{battery.valueTitle}</span></div>
          <div className="progress mt-3">
            <div
              className={`progress-bar ${battery.stateClassName}`}
              role="progressbar"
              style={{width: `${battery.valuePercents}%`}}/>
          </div>
          <div className="battery-icon">
            <i className={`bi bi-battery-half ${battery.stateClassName}`}/>
          </div>
        </div>

      </div>
    </div>
  );
}

// region getValueSettings 
const getValueSettings = (props: LayoutProps): {
  iconClassName: string,
  valueClassName: string,
  valueTitle: string
} => {
  const onOffReport = getReport(reportKeysValue, props);
  if (!onOffReport) return {
    iconClassName: deviceClasses["default"].icons!.onFalse,
    valueClassName: "status-unknown",
    valueTitle: "Unknown"
  }

  // try to get status of binary sensor
  const statusValue = onOffReport.parsed || onOffReport.val;
  const roleParts = onOffReport.role && onOffReport.role.split("&");
  const roleSettings = roleParts && roleParts.length > 1 ? JSON.parse(roleParts[1]) : undefined;
  const status: boolean = roleSettings && roleSettings["payload_on"]
    ? statusValue === roleSettings["payload_on"] // compare with role settings
    : (statusValue === "1" || statusValue === "01") // compare with default expected

  // views configuration
  const deviceClass: string = roleSettings && roleSettings["device_class"] || "default";
  const valueSettings: IDeviceClassSettings = {...deviceClasses["default"], ...deviceClasses[deviceClass]};

  const iconClassName = status ? `${valueSettings.icons!.onTrue} ${valueSettings.styles!.onTrue}` : `${valueSettings.icons!.onFalse} ${valueSettings.styles!.onFalse}`;
  const valueClassName = status ? `status ${valueSettings.styles!.onTrue}` : `status ${valueSettings.styles!.onFalse}`;
  const valueTitle = status ? valueSettings.titles.onTrue : valueSettings.titles.onFalse;

  return {iconClassName, valueClassName, valueTitle};
}
// endregion

// region getBatterySettings
const getBatterySettings = (props: LayoutProps): {
  stateClassName: string,
  valueTitle: string,
  valuePercents: number
} => {
  const report = getReport(reportKeysBattery, props);

  // return default for unknown
  if (!report) return {stateClassName: "??", valueTitle: "-", valuePercents: 0};

  const roleParts = report.role?.split("&");
  const roleSettings = roleParts && roleParts.length > 1 ? JSON.parse(roleParts[1]) : undefined;
  const units = roleSettings && roleSettings["unit_of_measurement"] || "";
  const valueString = Number(report.parsed || report.val) || undefined;
  let valuePercents: number | undefined = undefined;

  // get percents
  if (!valueString) valuePercents = undefined
  else if (units === "%") valuePercents = Number(valueString);
  else {
    let valueNumber = Number(valueString) || undefined;
    if (valueNumber) {
      valueNumber = Math.min(batteryValuesRange[1], Math.max(batteryValuesRange[0], valueNumber));
      valuePercents = Math.round((1 - (batteryValuesRange[1] - valueNumber) / (batteryValuesRange[1] - batteryValuesRange[0])) * 100);
    }
  }

  // views configuration
  const deviceClass: string = roleSettings && roleSettings["device_class"] || "default";
  const valueSettings: IDeviceClassSettings = {...deviceClasses["default"], ...deviceClasses[deviceClass]};

  const valueTitle = `${valueString || "??"} ${units}`;
  const stateClassName = !valuePercents
    ? "status-unknown"
    : valuePercents <= batteryWarningLevelPercents
      ? valueSettings.styles!.onFalse
      : valueSettings.styles!.onTrue;

  return {
    stateClassName,
    valuePercents: valuePercents || 0,
    valueTitle
  };
}
// endregion

const getReport = (oneOfKeys: string[], props: LayoutProps): ZespReportInfo | undefined => {
  for (const key of oneOfKeys) {
    const report = props.device.zespInfo.Report[key];
    if (report) return report;
  }
}
