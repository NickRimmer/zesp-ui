import React, {useState} from "react";
import "./styles.scss";
import {Card, FormControl, InputGroup, OverlayTrigger, Popover} from "react-bootstrap";
import {FadeIn} from "../../shared/fadein-transition";
import {IServerInfo} from "./interfaces";
import {ReactForm} from "../../shared/form/react-form";
import {useTranslation} from "react-i18next";

interface IProps {
  closeAction: () => void;
  deleteAction: () => void;
  addAction: (data: IServerInfo) => void;
  updateAction: (data: IServerInfo) => void;
  editServer?: IServerInfo;
}

export default (props: IProps) => {
  const {t} = useTranslation("pages.welcome");
  const [deleteConfirmed, setDeleteConfirmed] = useState(false);

  const onSubmit = (data: IServerInfo): Promise<void> => {
    if (props.editServer) props.updateAction(data);
    else props.addAction(data);

    return Promise.resolve();
  }

  const onDeleteClicked = () => {
    if (!deleteConfirmed) return;
    props.deleteAction();
  }

  const popover = (
    <Popover id="popover-basic">
      <Popover.Header as="h3">{t("edit.delete_title")}</Popover.Header>
      <Popover.Body><span dangerouslySetInnerHTML={{__html: t("edit.delete_message")}}/></Popover.Body>
    </Popover>
  );

  return (
    <div className="container welcome-page h-100">
      <FadeIn>
        <ReactForm onSubmit={onSubmit}>
          <Card className="text-start">
            <Card.Header className="d-flex justify-content-between">
              <span className="modal-title">{t("edit.title")}</span>
              <button type="button" className="btn-close" aria-label="Close" onClick={props.closeAction}/>
            </Card.Header>
            <Card.Body>
              <FormControl className="mb-2" id="name" defaultValue={props.editServer?.name} placeholder={t("edit.name_input_placeholder")}/>
              <InputGroup>
                <InputGroup.Text id="basic-addon3">{document.location.protocol === "https:" ? "wss" : "ws"}://</InputGroup.Text>
                <FormControl id="address" defaultValue={props.editServer?.address} aria-describedby="basic-addon3" placeholder={t("edit.address_input_placeholder")}/>
              </InputGroup>
            </Card.Body>

            {props.editServer && (
              <Card.Footer className="d-flex justify-content-between">
                {/*<button type="button" onClick={props.deleteAction} className="btn btn-outline-danger">Delete</button>*/}
                <div>
                  <OverlayTrigger trigger="click" placement="top" overlay={popover} rootClose={true} onToggle={setDeleteConfirmed}>
                    <button onClick={onDeleteClicked} type="button" className="btn btn-outline-danger">{t("edit.delete_button")}</button>
                  </OverlayTrigger>
                </div>
                <button type="submit" className="btn btn-primary">{t("edit.save_button")}</button>
              </Card.Footer>
            )}

            {!props.editServer && (
              <Card.Footer className="text-right">
                <button type="submit" className="btn btn-primary">{t("edit.add_button")}</button>
              </Card.Footer>
            )}
          </Card>
        </ReactForm>
      </FadeIn>
    </div>
  )
}