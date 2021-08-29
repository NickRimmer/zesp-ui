import React from "react";
import DataHaClusterIds from "../../data/zigbee/ha-cluster-ids.json";
import {useParams} from "react-router-dom";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceDialog} from "./DeviceDialog";
import NotFoundView from "./NotFoundView";
import {DeviceInfo, ReportInfo} from "../../services/zesp/models/DeviceInfo";
import {LayoutSettings} from "../../device-controls/settings";
import {ClusterInfo} from "../../models/ClusterInfo";
import {getControlForDevice} from "../../device-controls";

export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();
  const {state} = useGlobalState();
  const deviceInfo = state.devices?.find(x => x.IEEE === ieee && x.Device === device);

  if (!deviceInfo) return (
    <DeviceDialog title="Oops... Device information not found"><NotFoundView device={device} ieee={ieee}/></DeviceDialog>
  );

  const controlsData: LayoutSettings[] = deviceInfo.details?.layout
    ? require(`../../data/layouts/${deviceInfo.details.layout}`)
    : buildLayoutFromReports(deviceInfo);

  const controls = controlsData.map((control, i) => (<div key={i} className="device-control-group">{getControlForDevice(control, deviceInfo)}</div>));
  const content = (<div>{controls}</div>);
  return (<DeviceDialog title={deviceInfo!.Name || deviceInfo!.ModelId}>{content}</DeviceDialog>);
}

//TODO refactoring required to reduce method cyclomatic complexity
const buildLayoutFromReports = (device: DeviceInfo): LayoutSettings[] => {
  const getControlId = (report: ReportInfo): LayoutSettings => {
    const reportDetails = report.details;

    const clusterInfo = (DataHaClusterIds as ClusterInfo[]).find(x => x.id == reportDetails.clusterId);
    if (!clusterInfo) return {id: reportDetails.clusterId};

    // build layout based on role
    const roleInfo = report.role?.split("&");
    if (roleInfo && roleInfo.length > 0) {
      let attributeInfo = (clusterInfo.attributes && clusterInfo.attributes[roleInfo[0]]) || {id: roleInfo[0]} as LayoutSettings;

      // add role configured settings
      if (roleInfo.length > 1) {
        const roleControlSettings = JSON.parse(roleInfo[1]);
        attributeInfo = {...attributeInfo, ...roleControlSettings};
      }

      // add report settings
      attributeInfo = {...attributeInfo, ...{report: report}}

      return attributeInfo;
    }

    // try to read attribute info from layout
    const attributeInfo = clusterInfo.attributes && clusterInfo.attributes[reportDetails.attributeId];
    if (!attributeInfo) return {id: `${reportDetails.clusterId}:${reportDetails.attributeId}`};

    return attributeInfo;
  }

  const reports = Object.keys(device.Report);
  return reports.map(key => getControlId(device.Report[key]));
}

