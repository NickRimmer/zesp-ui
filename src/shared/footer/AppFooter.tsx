import React from "react";
import "./styles.scss";
import {useSelector} from "react-redux";
import {getZespFirmwareInstalledVersion} from "../../store/slices/zespFirmwareSlice";

export const AppFooter: React.FC = (): React.ReactElement => {
  const uiVersion = "0.0.1 alfa";
  const zespVersion = useSelector(getZespFirmwareInstalledVersion);

  return (
    <footer className="app-footer my-3">
      <div className="d-flex justify-content-center">
        <div><a href="https://github.com/NickRimmer/zesp-ui" target={"_blank"} rel="noreferrer">ZESP UI<i className="bi bi-github ms-2"/></a></div>
        <div className="mx-3 border-start opacity-25"/>
        <div>UI <span className="highlight">{uiVersion}</span></div>
        <div className="mx-3 border-start opacity-25"/>
        <div><a href="https://t.me/zesp32" target={"_blank"} rel="noreferrer">ZESP</a> <span className="highlight">{zespVersion}</span></div>
      </div>
    </footer>
  )
}

export default AppFooter;