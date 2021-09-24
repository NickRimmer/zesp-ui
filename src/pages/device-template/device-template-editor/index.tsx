import React, {useContext, useEffect, useRef, useState} from "react";
import "./styles.scss";
import HomeAutoClusters from "../../../data/reports.json";
import ResponseDataTypes from "./data-types.json";
import {ReportKeyInfo} from "../../../models/ReportKeyInfo";
import {Button, ButtonGroup, Col, FormGroup, FormLabel, ListGroup, Row} from "react-bootstrap";
import {IClusterAttributeCollection, IClusterInfo} from "../../../interfaces/IClusterInfo";
import toast from "react-hot-toast";
import {ZespDeviceInfo} from "../../../services/zesp/models/ZespDeviceInfo";
import {ZespContext} from "../../../shared/agents/ZespAgent";
import {ReportZespResponseValidator} from "../../../services/zesp/common/ZespResponseValidators";
import {ZespDeviceUpdate} from "../../../services/zesp/models/ZespDeviceUpdate";
import {DictionaryStrings} from "../../../models/DictionaryStrings";
import DeviceReportSettings from "../device-report-settings";
import {ZespReportInfo} from "../../../services/zesp/models/ZespReportInfo";
import FormCheckInput from "react-bootstrap/FormCheckInput";

interface IResponse {
  type: string,
  data?: string,
  parsed?: string
}

interface IReadMessage {
  type: "info" | "error",
  message: string
}

interface IProps {
  play?: ReportKeyInfo,
  template: ZespDeviceInfo,
  onAddReport: (keyInfo: ReportKeyInfo, reportInfo: ZespReportInfo) => void,
}

export const DeviceTemplateEditor: React.FC<IProps> = ({play, template, onAddReport}): React.ReactElement => {
  const [cluster, setCluster] = useState<string>(play?.clusterId || "")
  const [attribute, setAttribute] = useState<string>(play?.attributeId || "")
  const [attributes, setAttributes] = useState<IClusterAttributeCollection>()
  const [readData, setReadData] = useState<IResponse>()
  const [showAll, setShowAll] = useState(false)
  const [sendButtonDisabled, setSendButtonDisabled] = useState(false)
  const [readDataMessage, setReadDataMessage] = useState<IReadMessage>()
  const [showAddSettings, setShowAddSettings] = useState(false)
  const {zespRequestAsync} = useContext(ZespContext)
  const alignTimers = useRef<NodeJS.Timeout[]>([])
  const endpointClusters = template.EP && Object.entries(template.EP)[0] && Object.entries(template.EP)[0][1]

  const clusters = HomeAutoClusters
    .map(x => x as IClusterInfo)
    .filter(x => x.attributes && Object.keys(x.attributes).length > 0)
    .filter(x => showAll || endpointClusters?.ClO.indexOf(x.clusterId) >= 0 || endpointClusters?.ClI.indexOf(x.clusterId) >= 0)

  const responseDataTypes = ResponseDataTypes as DictionaryStrings

  useEffect(() => {
    if (template) {
      setCluster("")
      setAttribute("")
      setAttributes(undefined)
      setReadDataMessage(undefined)
      setReadData(undefined)
    }
  }, [template])

  useEffect(() => {
    if (!play) return;

    setCluster(play.clusterId)
    setAttribute(play.attributeId)
  }, [play])

  useEffect(() => {
    if (cluster) {
      setAttributes(clusters.find(x => x.clusterId === cluster)?.attributes)
    }
  }, [cluster])

  useEffect(() => {
    alignTimers.current.forEach(x => clearTimeout(x));
    alignTimers.current.push(setTimeout(() => alignSelected(), 500))
  }, [cluster, attribute])

  const alignSelected = (): void => {
    const lists = document.getElementsByClassName("list-group")
    let delay = 0;
    alignTimers.current.forEach(x => clearTimeout(x));
    for (let i = 0; i < lists.length; i++) {
      const listGroup = lists[i]
      if (!listGroup) continue

      const activeElement = listGroup.getElementsByClassName("btn active")
      if (activeElement.length == 0) continue
      const timer = setTimeout(() => activeElement[0]?.scrollIntoView({behavior: "smooth", block: "nearest"}), delay);
      alignTimers.current.push(timer);
      delay += 500;
    }
  }

  const onReadHandler = (): void => {
    setReadDataMessage(undefined);
    setReadData(undefined);

    if (!cluster && cluster.trim().length === 0) {
      toast.error("Cluster value required", {icon: "👾"})
      return
    }
    if (!attribute && attribute.trim().length === 0) {
      toast.error("Attribute value required", {icon: "☢️"})
      return
    }

    readingDataBegin(template.Device, "01", cluster, attribute);
  }

  const onAddHandler = (): void => {
    if (!cluster && cluster.trim().length === 0) {
      toast.error("Cluster value required", {icon: "👾"})
      return
    }

    setShowAddSettings(true);
  }

  const readingDataBegin = (deviceId: string, endpointId: string, clusterId: string, attributeId: string): void => {
    setReadDataMessage({type: "info", message: "Reading..."})
    setSendButtonDisabled(true)
    zespRequestAsync({
      data: `reqAtribute|${deviceId}|${endpointId}|${clusterId}|${attributeId}|0000`,
      responseValidator: ReportZespResponseValidator(deviceId, endpointId, clusterId, attributeId)
    })
      .then(event => {
        const data = JSON.parse(event.dataParts[0]) as ZespDeviceUpdate
        const response: IResponse = {
          type: responseDataTypes[data.Dtype] || data.Dtype,
          data: data.Data,
          parsed: data.parsed
        }

        setReadDataMessage(undefined)
        setReadData(response)
      })
      .catch(reason => {
        setReadDataMessage({type: "error", message: reason})
      })
      .finally(() => {
        setSendButtonDisabled(false)
      })
  }

  const getClusterType = (clusterId: string): string | undefined => {
    if (endpointClusters?.ClO && endpointClusters.ClO.indexOf(clusterId) !== -1 && endpointClusters?.ClI && endpointClusters.ClI.indexOf(clusterId) !== -1) return "in/out";
    if (endpointClusters?.ClO && endpointClusters.ClO.indexOf(clusterId) !== -1) return "out";
    if (endpointClusters?.ClI && endpointClusters.ClI.indexOf(clusterId) !== -1) return "in";
    return undefined;
  }

  return (
    <div className="template-editor">
      <div className="input-group mb-2">
        <input type="text" className="form-control text-center flex-grow-0" style={{width: "95px"}} defaultValue="01" readOnly/>
        <input type="text" className="form-control text-center" placeholder="Cluster" value={cluster} onChange={(event) => setCluster(event.target.value)}/>
        <input type="text" className="form-control text-center" placeholder="Attribute" value={attribute} onChange={(event) => setAttribute(event.target.value)}/>

        <button className="btn btn-outline-primary flex-grow-0" style={{width: "100px"}} type="button" onClick={onAddHandler} disabled={sendButtonDisabled}>
          <i className="bi bi-plus"/> Add
        </button>

        <button className="btn btn-outline-primary flex-grow-0" style={{width: "100px"}} type="button" onClick={onReadHandler} disabled={sendButtonDisabled}>
          <i className="bi bi-cloud-arrow-down-fill me-2"/> Read
        </button>
      </div>

      {readDataMessage && (
        <div className={`alert ${readDataMessage.type === "error" ? "alert-warning" : "alert-info"}`}>{readDataMessage.message}</div>
      )}

      {readData && (
        <div className="results alert alert-success">
          <div><span>Data type:</span> {readData.type}</div>
          <div><span>Response:</span> {readData.data || "undefined"}</div>
          <div><span>Parsed:</span> {readData.parsed || "undefined"}</div>
        </div>
      )}

      {clusters && clusters.length > 0 && (
        <Row>
          <Col xs={6} className="lists">
            <ListGroup as={ButtonGroup} vertical={true}>
              {clusters.map((x, i) => {
                const type = getClusterType(x.clusterId)
                return (
                  <ListGroup.Item key={i} as={Button} onClick={() => setCluster(x.clusterId)} active={x.clusterId === cluster}
                                  className="d-flex justify-content-between align-items-center">
                    <div className="me-auto item-title" title={x.name}>{x.name}</div>
                    <div className="badges">
                      {type && (<span className="badge bg-info rounded-pill">{type}</span>)}
                      <span className="badge bg-secondary rounded-pill">{x.clusterId}</span>
                    </div>
                  </ListGroup.Item>
                )
              })}
            </ListGroup>
          </Col>
          <Col xs={6} className="lists">
            {attributes && (
              <ListGroup as={ButtonGroup} vertical={true}>
                {Object.entries(attributes).map(([attributeId, x], i) => {
                  const attributeParts = attributeId.split(":");
                  return (
                    <ListGroup.Item key={i} as={Button} onClick={() => setAttribute(attributeParts[0])} active={attributeParts[0] === attribute}
                                    className="d-flex justify-content-between align-items-center">
                      <div className="me-auto item-title" title={x.name}>{x.name || "Unnamed"}</div>

                      <div className="badges">
                        {attributeParts.length > 1 && (<span className="badge bg-info rounded-pill">{attributeParts[1]}</span>)}
                        <span className="badge bg-secondary rounded-pill">{attributeParts[0]}</span>
                      </div>
                    </ListGroup.Item>
                  )
                })}
              </ListGroup>
            )}
          </Col>
        </Row>
      )}

      {(!clusters || clusters.length === 0) && (<div className="alert alert-warning text-center">No device related clusters found</div>)}

      {showAddSettings && (
        <DeviceReportSettings data={{reportInfo: undefined, keyInfo: {endpoint: "01", clusterId: cluster, attributeId: attribute}}}
                              onClosed={() => setShowAddSettings(false)}
                              onSave={onAddReport}/>)}

      <FormGroup className="text-end border-top mt-1 pt-2 d-flex align-items-center justify-content-end">
        <FormLabel className="m-0">
          Show all clusters and attributes
          <FormCheckInput className="ms-2" checked={showAll} onChange={() => setShowAll(!showAll)}/>
        </FormLabel>
      </FormGroup>
    </div>
  )
}

export default DeviceTemplateEditor;
