import React from "react";
import "./styles.scss";
import {useSelector} from "react-redux";
import {getZespFirmwareInstalledVersion} from "../../store/slices/zespFirmwareSlice";

export const AppFooter: React.FC = (): React.ReactElement => {
  const uiVersion = "0.0.1 alfa";
  const zespVersion = useSelector(getZespFirmwareInstalledVersion);

  return (
    <footer className="app-footer mt-3">
      <p className="d-flex justify-content-center">
        <div><a href="https://github.com/NickRimmer/zesp-ui" target={"_blank"} rel="noreferrer">ZESP UI<i className="bi bi-github ms-2"/></a></div>
        <div className="mx-3 border-start opacity-25"/>
        <div>UI <span className="highlight">{uiVersion}</span></div>
        <div className="mx-3 border-start opacity-25"/>
        <div>ZESP <span className="highlight">{zespVersion}</span></div>
      </p>
    </footer>
  )
}

export default AppFooter;