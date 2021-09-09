import React, {Fragment} from "react";
import {Redirect, Route} from "react-router-dom";
import {DeviceInfoPage, DevicesPage, SetupPage, SocketTestPage} from "./pages";
import {NotImplementedYetPage, SetupMqttPage, SetupWifiPage} from "./pages/setup/setup-pages";
import {getInitialized} from "./store/slices/zespSlice"
import {useSelector} from "react-redux";

export const Routes = () => {
  const isInitialized = useSelector(getInitialized);

  if (!isInitialized) return (<div>Initialization...</div>);
  return (
    <Fragment>
      {/*<Route exact path="/" component={MainPage}/>*/}
      <Route exact path="/"><Redirect to="/devices"/></Route>
      <Route path="/devices" component={DevicesPage}/>
      <Route path="/devices/:ieee" component={DeviceInfoPage}/>
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
}