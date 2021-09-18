import React from 'react';
import './styles.scss'
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";
import PowerDialogLink from "../power-dialog";

const Result = () => {
  const {t} = useTranslation("nav");

  return (
    <nav className="nav nav-masthead justify-content-center pe-2">
      {/*<NavLink className="nav-link" to="/" exact={true}>{t('home')}</NavLink>*/}
      <NavLink className="nav-link" to="/devices">{t('devices')}</NavLink>
      {process.env.NODE_ENV === "development" && (
        <NavLink className="nav-link" to="/socket-test" exact={true}>Test WS</NavLink>
      )}
      <NavLink className="nav-link" to="/setup">{t('setup')}</NavLink>
      <div className="border-start mx-3 opacity-25"/>
      <PowerDialogLink/>
    </nav>
  );
};

export default Result;