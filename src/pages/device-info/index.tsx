import React from "react";
import DataHaClusterIds from "../../data/zigbee/ha-cluster-ids.json";
import {useParams} from "react-router-dom";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceDialog} from "./DeviceDialog";
import NotFoundView from "./NotFoundView";
import {DeviceInfo, ReportInfo} from "../../services/zesp/models/DeviceInfo";
import {ClusterInfo} from "../../models/ClusterInfo";
import {getControlForDevice} from "../../device-controls";
import toast from "react-hot-toast";
import {LayoutSettings} from "../../models/LayoutSettings";

export default () => {
  const {ieee, device} = useParams<{ ieee: string, device: string }>();
  const {state} = useGlobalState();
  const deviceInfo = state.devices?.find(x => x.IEEE === ieee && x.Device === device);

  if (!deviceInfo) return (
    <DeviceDialog groups={["main"]} title="Oops... Device information not found"><NotFoundView device={device} ieee={ieee}/></DeviceDialog>
  );

  // build device layout
  const layoutSettings: LayoutSettings[] = deviceInfo.details?.layout
    ? buildLayoutSettingsFromFile(deviceInfo)
    : buildLayoutSettingsFromZesp(deviceInfo);

  // group by group name (undefined groups will be saved as 'main')
  const groups = layoutSettings.reduce((r, x) => {
    const groupName = x.group || "main";
    r[groupName] = [...r[groupName] || [], x];

    return r;
  }, {} as { [k: string]: LayoutSettings[] })

  // build groups content
  const content: groupContentElements[] = Object.keys(groups).map(groupName => {
    const elements = groups[groupName].map((settings, i) =>
      (<div key={i} className="device-control-group">{getControlForDevice(settings, deviceInfo)}</div>));

    return {groupName: groupName, elements: elements}
  });

  const onDetailsClicked = () => {
    toast.success("Check console log");
    console.log(deviceInfo);
  };

  return (<DeviceDialog groups={Object.keys(groups)} groupsContent={content} title={deviceInfo!.Name || deviceInfo!.ModelId} onDetailsClicked={onDetailsClicked}/>);
}

const buildLayoutSettingsFromFile = (device: DeviceInfo): LayoutSettings[] => {
  const settings: LayoutSettings[] = require(`../../data/layouts/${device.details?.layout}`);
  for (const s of settings) {
    if (s.value) {
      const reportKey = s.value.endpoint + s.value.clusterId + s.value.attributeId;
      s.report = device.Report[reportKey];
    }
  }

  return settings;
}

//TODO refactoring required to reduce method cyclomatic complexity
const buildLayoutSettingsFromZesp = (device: DeviceInfo): LayoutSettings[] => {
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

export type groupContentElements = {
  groupName: string,
  elements: JSX.Element[]
};