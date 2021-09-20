import {DeviceInfo} from "../../models/DeviceInfo";
import {useContext} from "react";
import {ZespContext} from "../../shared/agents/ZespAgent";
import {useSelector} from "react-redux";
import {getAllDevices} from "../../store/slices/devicesSlice";
import {DeviceListItem} from "../../models/DeviceListItem";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {Devices} from "../../services/devices";
import HomeAutoClusters from "../../data/reports.json";
import {DataReportInfo} from "../../models/DataReportInfo";

export default () => {
  const {getServerAddress} = useContext(ZespContext)
  const devices = useSelector(getAllDevices, devicesUpdateDetector)

  const serverAddress = getServerAddress() || "/"
  const deviceItems = [...devices]
    .sort(devicesSorting)
    .map(x => buildListItem(x, serverAddress))

  return {
    serverAddress,
    deviceItems,
  }
}

// region tools

const devicesUpdateDetector = (a: DeviceInfo[], b: DeviceInfo[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i].zespInfo.Name !== b[i].zespInfo.Name) return false;
  }

  return true;
}

const devicesSorting = (a: DeviceInfo, b: DeviceInfo): number => {
  if (a.zespInfo.ModelId === "ZESP_Root") return -1;
  if (b.zespInfo.ModelId === "ZESP_Root") return 1;

  if (a.zespInfo.ModelId < b.zespInfo.ModelId) return -1;
  if (a.zespInfo.ModelId > b.zespInfo.ModelId) return 1;

  return 0;
}

const buildListItem = (device: DeviceInfo, serverAddress: string): DeviceListItem => {
  const title = device.zespInfo.Name && device.zespInfo.Name.length > 0 ? device.zespInfo.Name : device.zespInfo.ModelId;
  const image = getImageUrl(device, serverAddress);
  const tags = getTagsFromReports(device.zespInfo.Report, device.zespInfo.DevType);

  return {
    title,
    ieee: device.zespInfo.IEEE,
    image,
    tags
  };
}

const getImageUrl = (device: DeviceInfo, serverAddress: string): string => {
  // device.settings?.image || device.zespInfo.Img
  if (device.settings?.image)
    return `${process.env.PUBLIC_URL}/device-images/${device.settings.image}`;

  if (device.zespInfo.Img)
    return `http://${serverAddress}:8081/${device.zespInfo.Img}`

  const modelId = device.zespInfo.ModelId;
  return `http://${serverAddress}:8081/img/${modelId}.jpg`;
}

const getTagsFromReports = (reports: { [key: string]: ZespReportInfo }, deviceType: string): string[] => {
  const result: string[] = [];

  for (const key of Object.keys(reports)) {
    const reportKeyDetails = Devices.getReportKeyDetails(key, deviceType);

    if (!reportKeyDetails) {
      console.warn(`Cannot read report '${key}' details for '${deviceType}' device type`);
      continue;
    }

    const clusterInfo = HomeAutoClusters.find(x => x.clusterId === reportKeyDetails.clusterId) as DataReportInfo | undefined
    result.push(clusterInfo?.name || reportKeyDetails.clusterId);
  }

  return result
    .filter((x, i) => result.indexOf(x) == i)
    .sort((a, b) => a > b ? 1 : -1);
}

// endregion
