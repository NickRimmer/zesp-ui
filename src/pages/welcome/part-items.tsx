import React from "react";
import "./styles.scss";
import {Card} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FadeIn} from "../../shared/fadein-transition";
import {IServerInfo} from "./interfaces";
import {useTranslation} from "react-i18next";

interface IProps {
  openAddServer: () => void,
  openEditAction: (server: IServerInfo) => void,
  openServerAction: (index: number) => void,
  servers: IServerInfo[]
}

export default (props: IProps) => {
  const {t} = useTranslation("pages.welcome");
  const sortedServers = props.servers
    .map((server, index) => ({server, index}))
    .sort((a, b) => a.server.name > b.server.name ? 1 : -1);

  return (
    <div className="container welcome-page h-100">
      <FadeIn className="fullscreen">
        <Card className="text-start">
          <Card.Header>{t("list.title")}</Card.Header>
          <Card.Body>
            {props.servers.length == 0 && (
              <div>{t("list.add_message")}</div>
            )}
            {props.servers.length > 0 && (
              <nav className="servers-list">
                {sortedServers.map((data, i) => (
                  <div className="item" key={`item-${i}`}>
                    <NavLink
                      className="server-button"
                      to="/"
                      onClick={(e) => {
                        props.openServerAction(data.index);
                        e.preventDefault();
                      }}
                      activeClassName="none"><i className="bi bi-caret-right-fill"/> {data.server.name}</NavLink>
                    <button type="button" onClick={() => props.openEditAction(data.server)} className="edit-button"><i className="bi bi-pencil-fill"/></button>
                  </div>
                ))}
              </nav>
            )}
          </Card.Body>
          <Card.Footer className="text-right">
            <button type="button" onClick={props.openAddServer} className="btn btn-primary">{t("list.add_button")}</button>
          </Card.Footer>
        </Card>
      </FadeIn>
    </div>
  )
}