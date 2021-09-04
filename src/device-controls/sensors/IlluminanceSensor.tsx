import React from "react";
import {Row} from "react-bootstrap";
import {LayoutSettingsSensor} from "../settings";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {DeviceControls} from "../../services/deviceControls";
import {HighlightOnUpdate} from "../../shared/transition/HighlightOnUpdate";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

//TODO localization
export const IlluminanceSensor = (props: IDeviceControlProps<LayoutSettingsSensor>) => {
  const report = DeviceControls.getControlReport(props);
  const value = report?.val ? parseInt(report.val, 16).toString() : null;

  return (
    <Row>
      <DeviceControlCol1>Illuminance:</DeviceControlCol1>
      <DeviceControlCol2>
        {value && (<HighlightOnUpdate>{value}</HighlightOnUpdate>)}
        {!value && (<span className="alert alert-warning small py-2 m-0">No data</span>)}
      </DeviceControlCol2>
    </Row>
  )
}
