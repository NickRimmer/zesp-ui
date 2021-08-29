import React, {Fragment} from "react";
import {Route} from "react-router-dom";
import {DeviceInfoPage, DevicesPage, MainPage, SetupPage, SocketTestPage} from "./pages";
import {NotImplementedYetPage, SetupMqttPage, SetupWifiPage} from "./pages/setup/setup-pages";

export const Routes = () => (
  <Fragment>
      <Route exact path="/" component={MainPage}/>
      <Route path="/devices" component={DevicesPage}/>
      <Route path="/devices/:ieee-:device" component={DeviceInfoPage}/>
      <Route path="/setup" component={SetupPage}/>
      <Route exact path="/setup" component={SetupWifiPage}/>
      <Route path="/setup/mqtt" component={SetupMqttPage}/>
      <Route path="/setup/zigbee" component={NotImplementedYetPage}/>
      <Route path="/setup/telegram" component={NotImplementedYetPage}/>
      <Route path="/setup/z2m" component={NotImplementedYetPage}/>
      <Route path="/setup/zesp-ui" component={NotImplementedYetPage}/>
      <Route path="/socket-test" component={SocketTestPage}/>
  </Fragment>
)