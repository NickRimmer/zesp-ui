import React, {Fragment} from "react";
import {Redirect, Route} from "react-router-dom";
import {DeviceInfoPage, DevicesPage, SetupPage, SocketTestPage} from "./pages";
import {NotImplementedYetPage, SetupMqttPage, SetupWifiPage} from "./pages/setup/setup-pages";
import {getInitialized} from "./store/slices/zespSlice"
import {setSpinnerShow} from "./store/slices/spinnerSlice"
import {useDispatch, useSelector} from "react-redux";
import DeviceTemplatePage from "./pages/device-template";

export const Routes = () => {
  const isInitialized = useSelector(getInitialized);
  const dispatch = useDispatch();

  if (!isInitialized) {
    // return (<div>Initialization...</div>);
    setTimeout(() => dispatch(setSpinnerShow(true)), 0);
    return (<Fragment/>);
  }

  setTimeout(() => dispatch(setSpinnerShow(false)), 300);

  return (
    <Fragment>
      {/*<Route exact path="/" component={MainPage}/>*/}
      <Route exact path="/"><Redirect to="/devices"/></Route>
      <Route path="/devices" component={DevicesPage}/>
      <Route path="/devices/:ieee" component={DeviceInfoPage}/>
      <Route path="/device/template/:ieee" component={DeviceTemplatePage}/>
      <Route path="/setup" component={SetupPage}/>
      <Route exact path="/setup" component={SetupWifiPage}/>
      <Route path="/setup/mqtt" component={SetupMqttPage}/>
      <Route path="/setup/zigbee" component={NotImplementedYetPage}/>
      <Route path="/setup/telegram" component={NotImplementedYetPage}/>
      <Route path="/setup/z2m" component={NotImplementedYetPage}/>
      <Route path="/setup/zesp-ui" component={NotImplementedYetPage}/>
      <Route path="/setup/firmware" component={NotImplementedYetPage}/>
      <Route path="/socket-test" component={SocketTestPage}/>
    </Fragment>
  )
}