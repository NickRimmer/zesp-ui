import React, {useState} from "react";
import {AppDialog} from "../../../shared/app-dialog";
import {ZespReportInfo} from "../../../services/zesp/models/ZespReportInfo";
import {ReportKeyInfo} from "../../../models/ReportKeyInfo";
import {Button, Col, Form, Row} from "react-bootstrap";

interface IProps {
  data: { keyInfo: ReportKeyInfo, reportInfo?: ZespReportInfo },

  onClosed: () => void,
  onSave: (keyInfo: ReportKeyInfo, reportInfo: ZespReportInfo) => void,
}

export const DeviceReportSettings: React.FC<IProps> = ({
  data,
  onClosed,
  onSave,
}): React.ReactElement => {
  const [label, setLabel] = useState(data.reportInfo?.label || "")
  const [role, setRole] = useState(data.reportInfo?.role || "")
  const [mat, setMat] = useState(data.reportInfo?.mat || "")
  const [forceClose, setForceClose] = useState(false);

  const roleDataList = ["binary_sensor", "fan", "alarm_control_panel", "lock", "climate", "light_XY", "light_rgb", "light_hue", "light_temp", "light_level", "light_onoff", "light", "livolo_swith1ch", "outlet", "switch", "cover", "sensor"]
    .sort();

  const onSaveHandler = (): void => {
    const result = {...data.reportInfo || {} as ZespReportInfo, ...{label, role, mat}}
    onSave(data.keyInfo, result);
    setForceClose(true);
  }

  const footer = (
    <>
      <Button type="submit">Save</Button>
      <Button variant="secondary" onClick={() => setForceClose(true)}>Cancel</Button>
    </>
  )

  return (
    <AppDialog title={`Report settings for '${data.keyInfo.endpoint} ${data.keyInfo.clusterId} ${data.keyInfo.attributeId}'`} onClosed={onClosed} footer={footer}
               forceClose={forceClose} onSubmit={onSaveHandler}>
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">Label</Form.Label>
        <Col><Form.Control value={label || ""} onChange={event => setLabel(event.target.value)} placeholder="Label is required" isInvalid={!label}/></Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">Role</Form.Label>
        <Col><Form.Control value={role || ""} onChange={event => setRole(event.target.value)} placeholder="Default" {...{list: "roles-list"}}/></Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="4">Mat (???)</Form.Label>
        <Col><Form.Control value={mat || ""} onChange={event => setMat(event.target.value)} placeholder="Default"/></Col>
      </Form.Group>

      <datalist id="roles-list">
        {roleDataList.map((x, i) => (<option key={i} value={x}/>))}
      </datalist>
    </AppDialog>
  )
}

export default DeviceReportSettings;