import React, {Fragment, ReactNode, useState} from "react";
import "./styles.scss";
import {useHistory} from "react-router-dom";
import {Modal} from "react-bootstrap";
import {groupContentElements} from "./index";

export interface IProps {
  children?: ReactNode,
  groupsContent?: groupContentElements[],
  title: string,
  onDetailsClicked?: () => void,
  groups: string[],
}

export const DeviceDialog = (props: IProps) => {
  if (props.groups.length == 0) {
    console.error("Missed groups list of controls");
    return (<>Missed groups list of controls</>);
  }

  const history = useHistory();
  const [show, setShow] = useState(true);
  const [activeGroup, setActiveGroup] = useState(props.groups[0]);
  const groups = props.groups;

  const handleClose = () => setShow(false);
  const handleExit = () => setTimeout(() => history.push("/devices"), 100);

  const getHeaderForMultiplyGroups = () => (
    <ul className="nav nav-tabs">
      {groups.map((groupName, i) =>
        (
          <li className="nav-item" key={i}>
            <button
              type="button"
              className={`btn btn-light nav-link ${activeGroup === groupName ? "active" : ""}`}
              onClick={() => setActiveGroup(groupName)}>
              {groupName === "main" ? props.title : groupName}
            </button>
          </li>
        )
      )}
    </ul>
  );

  const getSingleHeader = () => (<div>{props.title}</div>);

  const header = groups.length > 1 ? getHeaderForMultiplyGroups() : getSingleHeader();

  return (
    <Modal show={show} onHide={handleClose} onExited={handleExit} size="lg">
      <Modal.Header className={groups.length > 1 ? "with-tabs" : ""}>
        {header}

        <div className="text-end modal-right-buttons">
          <span>
            {props.onDetailsClicked && (<button type="button" className="btn" onClick={props.onDetailsClicked}><i className="bi bi-archive"/></button>)}
          </span>
          <span className="border-end mx-3"/>
          <button type="button" className="btn" onClick={() => setShow(!show)}><i className="bi bi-x-lg"/></button>
        </div>
      </Modal.Header>
      <Modal.Body className="text-start device-dialog">
        {props.children}
        {props.groupsContent && props.groupsContent.map(group => group.groupName === activeGroup
          ? (<div key={group.groupName}>{group.elements}</div>)
          : (<Fragment key={group.groupName}/>)
        )}
      </Modal.Body>
    </Modal>
  )
}