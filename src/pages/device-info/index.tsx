import React from "react";
import {useParams} from "react-router-dom";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceDialog} from "./DeviceDialog";
import NotFoundView from "./NotFoundView";
import {DeviceInfo} from "../../services/zesp/models/DeviceInfo";
import {DeviceControlInfo, LayoutConfigOnOff} from "../../models/DeviceControlInfo";
import {OnOffDeviceControl} from "../../device-controls/OnOffDeviceControl";
import {UnknownDeviceControl} from "../../device-controls/UnknownDeviceControl";

export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();
  const {state} = useGlobalState();
  const data = state.devices?.find(x => x.IEEE === ieee && x.Device === device);

  if (!data) return (
    <DeviceDialog title="Oops... Device information not found"><NotFoundView device={device} ieee={ieee}/></DeviceDialog>
  );

  const controlsData: DeviceControlInfo[] = data.templateInfo?.layout
    ? require(`../../data/layouts/${data.templateInfo.layout}`)
    : buildLayout(data);

  const controls = controlsData.map((control, i) => (<div key={i}>{getControl(control)}</div>));
  const content = (<div>{controls}</div>);
  return (<DeviceDialog title={data!.Name || data!.ModelId}>{content}</DeviceDialog>);
}

const buildLayout = (device: DeviceInfo): DeviceControlInfo[] => {
  return []; //TODO build layout based on data from ZESP
}

const getControl = (control: DeviceControlInfo) => {
  switch (control.id) {
    case "on_off" :
      return (<OnOffDeviceControl config={control.config as LayoutConfigOnOff}/>);
    default:
      return (<UnknownDeviceControl data={control}/>)
  }
}