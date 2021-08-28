import React from 'react';
import {useTranslation} from "react-i18next";
import {NavLink} from "react-router-dom";

import './styles.scss'

const Result = () => {
  const {t} = useTranslation("nav");

  return (
    <nav className="nav nav-masthead justify-content-center">
      <NavLink className="nav-link" to="/" exact={true}>{t('home')}</NavLink>
      <NavLink className="nav-link" to="/devices">{t('devices')}</NavLink>
      <NavLink className="nav-link" to="/socket-test" exact={true}>Test WS</NavLink>
      <NavLink className="nav-link" to="/setup">{t('setup')}</NavLink>
    </nav>
  );
};

export default Result;