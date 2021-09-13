import {DataControlSettings, DataLayoutItemsGroup} from "../models/DataControlSettings";
import {DataReportInfo} from "../models/DataReportInfo";
import DataHaClusterIds from "../data/reports.json";
import {DeviceInfo} from "../models/DeviceInfo";
import {ReportKeyInfo} from "../models/ReportKeyInfo";

const defaultLayoutGroupName = "main";

export const Devices = {
  getControlGroups: (device: DeviceInfo): DataLayoutItemsGroup[] => {
    const layout = device.customLayout && device.customLayout.length > 0
      ? device.customLayout
      : buildLayoutSettingsFromZesp(device);

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

  getReportKeyDetails: (reportKey: string, deviceType: string): ReportKeyInfo | undefined => {
    if (!deviceType || deviceType === "ZED" || deviceType === "ZR") {
      if (reportKey?.length !== 10) // 01 0000 0000
      {
        console.warn(`Unknown format of Zigbee report key: '${reportKey}'`);
        return undefined;
      }

      return {
        endpoint: reportKey.substr(0, 2),
        clusterId: reportKey.substr(2, 4),
        attributeId: reportKey.substr(6),
      }
    }

    if (deviceType === "BED") {
      if (reportKey?.length < 1) // a-ny-thing
      {
        console.warn(`Unknown format of BLE report key: '${reportKey}'`);
        return undefined;
      }

      return {
        endpoint: "",
        clusterId: reportKey,
        attributeId: "",
      }
    }

    console.warn(`Unknown device type '${deviceType}'`);
    return undefined;
  },
}

const buildLayoutSettingsFromZesp = (device: DeviceInfo): DataControlSettings[] => {
  const getLayoutItem = (reportKey: string): DataControlSettings | undefined => {
    const reportKeyInfo = Devices.getReportKeyDetails(reportKey, device.zespInfo.DevType);
    if (!reportKeyInfo) {
      console.warn(`Cannot get report key details for '${device.zespInfo.IEEE}' device`);
      return undefined;
    }

    const registeredCluster = (DataHaClusterIds as DataReportInfo[]).find(x => x.clusterId == reportKeyInfo.clusterId);

    const result = {
      id: reportKeyInfo.clusterId,
      reportKey: reportKeyInfo
    } as DataControlSettings;

    // if cluster information not found
    if (!registeredCluster) {
      console.debug(`Report key '${reportKey}' with unregistered cluster '${reportKeyInfo.clusterId}' received`);
      return result;
    }

    // build layout based on role
    const report = device.zespInfo.Report[reportKey];
    const roleParts = report.role?.split("&");
    if (roleParts && roleParts.length > 0)
      return {...result, ...buildLayoutItemForRole(roleParts, registeredCluster, reportKey, device.zespInfo.DevType)};

    // otherwise build layout based on cluster
    const attributeInfo = registeredCluster.attributes && registeredCluster.attributes[reportKeyInfo.attributeId];
    if (!attributeInfo) return result;

    return attributeInfo;
  }

  const reportKeys = Object.keys(device.zespInfo.Report);
  return reportKeys.map(key => getLayoutItem(key)).filter(x => x !== undefined) as DataControlSettings[];
}

const buildLayoutItemForRole = (roleParts: string[], dataCluster: DataReportInfo, reportKey: string, deviceType: string): DataControlSettings | undefined => {
  // return undefined;
  const reportKeyInfo = Devices.getReportKeyDetails(reportKey, deviceType);
  if (!reportKeyInfo) return undefined;

  const roleName = roleParts[0];
  const roleSettings = roleParts.length > 1 ? roleParts[1] : null;
  const layoutItem = !dataCluster.attributes
    ? {id: roleName} as DataControlSettings // if no attributes at all
    : dataCluster.attributes[`${reportKeyInfo.attributeId}:${roleName}`]
    || dataCluster.attributes[roleName]
    || {id: roleName} as DataControlSettings; // if required attribute not found

  // add role configured settings
  if (roleSettings)
    layoutItem.zespRoleSettings = JSON.parse(roleSettings);

  return layoutItem;
}