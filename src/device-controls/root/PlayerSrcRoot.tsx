import React, {ChangeEvent, useState} from "react";
import {Col, Row} from "react-bootstrap";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DataLayoutItem} from "../../models/DataLayoutItem";
import {DeviceControls} from "../../services/deviceControls";
import {useGlobalState} from "../../shared/global-state-provider";

// TODO add localization
export const PlayerSrcRoot = (props: IDeviceControlProps<DataLayoutItem>) => {
  const report = DeviceControls.extractReport(props);
  const [value, setValue] = useState(report?.val || "");
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
    setValue(value);

    DeviceControls.trySetReportValue(globalState, props, value);
  }

  const handleClear = () => {
    setValue("");
    DeviceControls.trySetReportValue(globalState, props, "");
  }

  return (
    <Row>
      <Col md="3" lg="2">Radio stream:</Col>
      <Col>
        <div className="input-group">
          <input className="form-control" list="datalistOptions" placeholder="Click to see dropdown suggestions" value={value} onChange={handleChange}/>
          <button className="btn btn-outline-secondary rounded-end" type="button" onClick={handleClear}>&times;</button>
          <datalist id="datalistOptions">
            {srcs.map((src, i) => (<option key={i} value={src}/>))}
          </datalist>
        </div>
      </Col>
    </Row>
  )
}
