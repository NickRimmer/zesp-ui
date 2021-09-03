import {IGlobalState} from "../global-state";
import {DataLayoutItem, DataLayoutItemsGroup} from "../models/DataLayoutItem";
import {DataReportInfo} from "../models/DataReportInfo";
import DataHaClusterIds from "../data/reports.json";
import {DeviceInfo} from "../models/DeviceInfo";
import {ReportKeyInfo} from "../models/ReportKeyInfo";

const defaultLayoutGroupName = "main";

export const Devices = {
  getDevice: (globalState: IGlobalState, ieee: string, deviceId: string): DeviceInfo | undefined =>
    globalState.state.devices?.find(x => x.zespInfo.IEEE === ieee && x.zespInfo.Device === deviceId),

  getControlGroups: (device: DeviceInfo): DataLayoutItemsGroup[] => {
    const layout = device.customLayout || buildLayoutSettingsFromZesp(device);

    // group by group name (undefined groups will be saved as 'main')
    return layout.reduce((r, x) => {
      const groupName = x.group || defaultLayoutGroupName;
      let group = r.find(x => x.name === groupName);
      if (!group) {
        group = {name: groupName} as DataLayoutItemsGroup;
        r.push(group);
      }

      group.settings = [...group.settings || [], x];

      return r;
    }, [] as DataLayoutItemsGroup[]);
  },

  getReportKeyDetails: (reportKey: string): ReportKeyInfo => {
    if (reportKey?.length != 10)
      throw Error(`Unknown format of report key: ${reportKey}`);

    return {
      endpoint: reportKey.substr(0, 2),
      clusterId: reportKey.substr(2, 4),
      attributeId: reportKey.substr(6, 4),
    }
  },
}

const buildLayoutSettingsFromZesp = (device: DeviceInfo): DataLayoutItem[] => {
  const getLayoutItem = (reportKey: string): DataLayoutItem => {
    const reportKeyInfo = Devices.getReportKeyDetails(reportKey);
    const registeredCluster = (DataHaClusterIds as DataReportInfo[]).find(x => x.clusterId == reportKeyInfo.clusterId);

    const result = {
      id: reportKeyInfo.clusterId,
      reportKey: reportKeyInfo
    } as DataLayoutItem;

    // if cluster information not found
    if (!registeredCluster) {
      console.debug(`Report key '${reportKey}' with unregistered cluster '${reportKeyInfo.clusterId}' received`);
      return result;
    }

    // build layout based on role
    const report = device.zespInfo.Report[reportKey];
    const roleParts = report.role?.split("&");
    if (roleParts && roleParts.length > 0)
      return {...result, ...buildLayoutItemForRole(roleParts, registeredCluster, reportKey)};

    // otherwise build layout based on cluster
    const attributeInfo = registeredCluster.attributes && registeredCluster.attributes[reportKeyInfo.attributeId];
    if (!attributeInfo) return result;

    return attributeInfo;
  }

  const reportKeys = Object.keys(device.zespInfo.Report);
  return reportKeys.map(key => getLayoutItem(key));
}

const buildLayoutItemForRole = (roleParts: string[], dataCluster: DataReportInfo, reportKey: string): DataLayoutItem => {
  const reportKeyInfo = Devices.getReportKeyDetails(reportKey);

  const attributeId = roleParts[0];
  const roleSettings = roleParts.length > 1 ? roleParts[1] : null;
  const layoutItem = !dataCluster.attributes
    ? {id: attributeId} as DataLayoutItem // if no attributes at all
    : dataCluster.attributes[`${reportKeyInfo.attributeId}:${attributeId}`]
    || dataCluster.attributes[attributeId]
    || {id: attributeId} as DataLayoutItem; // if required attribute not found

  // add role configured settings
  if (roleSettings)
    layoutItem.zespRoleSettings = JSON.parse(roleSettings);

  return layoutItem;
}