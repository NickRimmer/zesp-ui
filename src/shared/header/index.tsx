import React from "react";
import "./styles.scss";
import TopMenu from "../top-menu";
import {UpdatesNotification} from "../updates-notification/UpdatesNotification";

export const AppHeader: React.FC = (): React.ReactElement => {
  return (
    <header className="app-header">
      <a href="/"><h3 className="title">ZESP:UI</h3></a>
      <div className="d-flex flex-row align-items-center">
        <TopMenu/>
        <UpdatesNotification/>
      </div>
    </header>
  )
}

export default AppHeader;