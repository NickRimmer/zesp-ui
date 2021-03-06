import React, {FunctionComponent, useEffect, useState} from "react";
import {LayoutProps} from "../../../models/LayoutProps";
import {HighlightOnUpdate} from "../../../shared/transition/HighlightOnUpdate";

const lastUpdateTresholdSeconds = 60 * 5;

export const BleBeacon: FunctionComponent<LayoutProps> = (props) => {
  const isInRange = props.device.zespInfo.Report["ble_InRange"]?.parsed === "1";
  const signalLevel = props.device.zespInfo.Report["ble_signal_level"]?.parsed;

  const lastUpdateMs = Math.max(props.device.zespInfo.Report["ble_InRange"].time, props.device.zespInfo.Report["ble_signal_level"].time);
  const lastDate = new Date(lastUpdateMs);
  const calculateRelative = () => Math.round((Date.now() - lastUpdateMs) / 1000);
  const [relative, setRelative] = useState(calculateRelative());

  useEffect(() => {
    const timer = setInterval(() => {
      setRelative(calculateRelative());
    }, 1000);
    return () => {
      clearInterval(timer);
    }
  }, [lastUpdateMs]);

  const lastUpdateStyle = relative < lastUpdateTresholdSeconds
    ? "status-primary"
    : "status-unknown";

  const rangeStyle = isInRange
    ? "status-primary"
    : "status-unknown";

  return (
    <div className="row custom-layout">
      <div className="col col-5 left flex-column position-relative">
        <i className={`bi bi-wifi ${rangeStyle}`}/>
        <div className={`icon-description ${rangeStyle}`}>{isInRange ? "In range" : "Out of range"}</div>
      </div>
      <div className="col right flex-column justify-content-center">
        <div className="text-center">
          <div>Signal level:</div>
          <div className={`status ${rangeStyle}`}><HighlightOnUpdate>{signalLevel}</HighlightOnUpdate></div>
        </div>
        <div className="text-center mt-3">
          <div>Last update:</div>
          <div className={`status ${lastUpdateStyle}`}>{lastDate.toLocaleDateString()} {lastDate.toLocaleTimeString()}</div>
          <div className="small text-muted opacity-50">{
            relative < 60 ? `${relative} seconds ago` :
              relative / 60 < 60 ? `${Math.round(relative / 60)} minutes ago` :
                `${Math.round(relative / 60 / 60)} hours ago`
          }</div>
        </div>
      </div>
    </div>
  )
}

export default BleBeacon;