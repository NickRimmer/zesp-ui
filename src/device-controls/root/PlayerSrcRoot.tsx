import React, {ChangeEvent, useEffect, useState} from "react";
import {Row} from "react-bootstrap";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DataLayoutItem} from "../../models/DataLayoutItem";
import {DeviceControls} from "../../services/deviceControls";
import {useGlobalState} from "../../shared/global-state-provider";
import toast from "react-hot-toast";
import {LayoutSettingsOnOff} from "../settings";
import {Single} from "../../services/single";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

// TODO add localization
export const PlayerSrcRoot = (props: IDeviceControlProps<DataLayoutItem>) => {
  const srcReport = DeviceControls.getControlReport(props);
  const [playSettings, playReport] = DeviceControls.getControlSettings<LayoutSettingsOnOff>(props, "player_control_root");

  if (!srcReport) {
    useEffect(() => {
      toast.error(`'${props.config.id}' layout settings not found`);
    }, []);
    return (<></>);
  }

  if (!playReport) {
    useEffect(() => {
      toast.error("'player_control_root' layout settings not found");
    }, []);
    return (<></>);
  }

  const [src, setSrc] = useState(srcReport.val || "");
  const [play, setPlay] = useState(playReport!.val || "OFF");
  const globalState = useGlobalState();

  const srcs: string[] = [
    "http://chanson.hostingradio.ru:8041/chanson128.mp3",
    "http://dorognoe.hostingradio.ru:8000/radio?type=.mp3",
    "http://stream3.radiostyle.ru:8001/biker-fm",
    "http://air.radiorecord.ru:8102/sd90_320",
    "http://stream.hitroe.com/stream",
    "http://air.radiorecord.ru:8102/tm_320",
    "http://eu.radioboss.fm:8024/stream"
  ];

  const handleChange = (event: ChangeEvent) => {
    const value = (event.target as HTMLInputElement).value
    setSrc(value);

    DeviceControls.setControlReport(globalState, props, value);
  }

  const handleStop = () => {
    console.log("stop");
    setPlay("OFF");
    DeviceControls.setControlReport(globalState, props, "OFF", playSettings!.reportKey);

    setSrc("");
    DeviceControls.setControlReport(globalState, props, "");

    if (playSettings) Single.ZespConnector.send({data: playSettings.arguments.commandOff});
    else console.warn("No configured OFF command for 'player_control_root' operation found in layout");
  }

  const handlePlay = () => {
    if (!src || src.length === 0) {
      toast.error("Please select source first", {icon: "🎵"});
      return;
    }

    setPlay("ON");
    DeviceControls.setControlReport(globalState, props, "ON", playSettings!.reportKey);
    if (playSettings) Single.ZespConnector.send({data: playSettings.arguments.commandOn.replace("{value}", src)});
    else console.warn("No configured ON command for 'player_control_root' operation found in layout");
  }

  return (
    <Row>
      <DeviceControlCol1>Radio stream:</DeviceControlCol1>
      <DeviceControlCol2>
        <div className="input-group">
          <input className="form-control" list="datalistOptions" placeholder="Click to see dropdown suggestions" value={src} onChange={handleChange}/>
          <button className={`btn btn-outline-secondary ${play !== "ON" ? "active" : ""}`} type="button" onClick={handleStop}><i className="bi-stop"/></button>
          <button className={`btn btn-outline-secondary rounded-end ${play === "ON" ? "active" : ""}`} type="button" onClick={handlePlay}><i className="bi-play"/></button>
          <datalist id="datalistOptions">
            {srcs.map((src, i) => (<option key={i} value={src}/>))}
          </datalist>
        </div>
      </DeviceControlCol2>
    </Row>
  )
}
