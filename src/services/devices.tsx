import {IGlobalState} from "../global-state";
import {DeviceInfo, ReportInfo} from "./zesp/models/DeviceInfo";
import {LayoutSettings, LayoutSettingsGroup} from "../models/LayoutSettings";
import {ClusterInfo} from "../models/ClusterInfo";
import DataHaClusterIds from "../data/zigbee/ha-cluster-ids.json";

const defaultLayoutGroupName = "main";

export const Devices = {
  getDevice: (globalState: IGlobalState, ieee: string, deviceId: string): DeviceInfo | undefined =>
    globalState.state.devices?.find(x => x.IEEE === ieee && x.Device === deviceId),

  getControlGroups: (device: DeviceInfo): LayoutSettingsGroup[] => {
    const predefinedLayoutFile = device.details?.layout;
    const layout = predefinedLayoutFile
      ? buildLayoutSettingsFromFile(device)
      : buildLayoutSettingsFromZesp(device);

    // group by group name (undefined groups will be saved as 'main')
    return layout.reduce((r, x) => {
      const groupName = x.group || defaultLayoutGroupName;
      let group = r.find(x => x.name === groupName);
      if (!group) {
        group = {name: groupName} as LayoutSettingsGroup;
        r.push(group);
      }

      group.settings = [...group.settings || [], x];

      return r;
    }, [] as LayoutSettingsGroup[]);
  },
}

const buildLayoutSettingsFromFile = (device: DeviceInfo): LayoutSettings[] => {
  const settings: LayoutSettings[] = require(`../data/layouts/${device.details!.layout}`);
  for (const s of settings) {
    if (s.value) {
      const reportKey = s.value.endpoint + s.value.clusterId + s.value.attributeId;
      s.report = device.Report[reportKey];
    }
  }

  return settings;
}

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
