import React, {useEffect, useRef, useState} from "react";
import "./styles.scss";
import HomeAutoClusters from "../../../data/reports.json";
import {ReportKeyInfo} from "../../../models/ReportKeyInfo";
import {Button, ButtonGroup, Col, ListGroup, Row} from "react-bootstrap";
import {IClusterAttributeCollection, IClusterInfo} from "../../../interfaces/IClusterInfo";
import toast from "react-hot-toast";

interface IProps {
  play?: ReportKeyInfo
}

export const DeviceTemplateEditor: React.FC<IProps> = ({play}): React.ReactElement => {
  const [cluster, setCluster] = useState<string>(play?.clusterId || "")
  const [attribute, setAttribute] = useState<string>(play?.attributeId || "")
  const [attributes, setAttributes] = useState<IClusterAttributeCollection>()
  const alignTimers = useRef<NodeJS.Timeout[]>([]);
  const clusters = HomeAutoClusters
    .map(x => x as IClusterInfo)
    .filter(x => Object.keys(x.attributes).length > 0)

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

  const alignSelected = () => {
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

  const onReadHandler = () => {
    toast.success("Not implemented yet", {icon: "😵‍💫"})
  }

  return (
    <div className="template-editor">
      <div className="input-group mb-2">
        <input type="text" className="form-control text-center flex-grow-0" style={{width: "95px"}} defaultValue="01" readOnly/>
        <input type="text" className="form-control text-center" placeholder="Cluster" value={cluster} onChange={(event) => setCluster(event.target.value)}/>
        <input type="text" className="form-control text-center" placeholder="Attribute" value={attribute} onChange={(event) => setAttribute(event.target.value)}/>
        <button className="btn btn-primary flex-grow-0" style={{width: "100px"}} type="button" onClick={onReadHandler}><i className="bi bi-cloud-arrow-down-fill me-2"/> Read
        </button>
      </div>
      <Row>
        <Col xs={6} className="lists">
          <ListGroup as={ButtonGroup} vertical={true}>
            {clusters.map((x, i) => (
              <ListGroup.Item key={i} as={Button} onClick={() => setCluster(x.clusterId)} active={x.clusterId === cluster}
                              className="d-flex justify-content-between align-items-center">
                <div className="me-auto item-title" title={x.name}>{x.name}</div>
                <span className="badge bg-primary rounded-pill">{x.clusterId}</span>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
        <Col xs={6} className="lists">
          {!attributes && (<span>Select cluster first</span>)}
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
    </div>
  )
}

export default DeviceTemplateEditor;
