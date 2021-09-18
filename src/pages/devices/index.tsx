import React, {useContext} from "react";
import "./styles.scss";
import {FadeIn} from "../../shared/fadein-transition";
import {Card, Row} from "react-bootstrap";
import Item from "./item";
import {useTranslation} from "react-i18next";
import {DeviceInfo} from "../../models/DeviceInfo";
import {DeviceListItem} from "../../models/DeviceListItem";
import HomeAutoClusters from "../../data/reports.json";
import {DataReportInfo} from "../../models/DataReportInfo";
import {Devices} from "../../services/devices";
import {ZespReportInfo} from "../../services/zesp/models/ZespReportInfo";
import {getAllDevices} from "../../store/slices/devicesSlice";
import {useSelector} from "react-redux";
import {ZespContext} from "../../shared/agents/ZespAgent";
import {AddDeviceButton} from "./add-buttons";

const Result: React.FC = (): React.ReactElement => {
  const {getServerAddress} = useContext(ZespContext);
  const devices = useSelector(getAllDevices, (a: DeviceInfo[], b: DeviceInfo[]) => a.length === b.length);
  if (devices.length == 0) return (
    <div>No devices found...</div>
  )

  console.debug("Building list of devices to show...");
  const serverAddress = getServerAddress() || "/";
  const deviceItems = [...devices]
    .sort(devicesSorting)
    .map(x => buildListItem(x, serverAddress));

  console.debug("devices page updated...");
  return (
    <FadeIn>
      <div className="devices">
        <Card>
          <Card.Body>
            <DevicesList devices={deviceItems}/>
          </Card.Body>
        </Card>
      </div>
    </FadeIn>
  );
}

const DevicesList = (props: { devices: DeviceListItem[] }) => {
  const {t} = useTranslation("pages.devices");
  const {devices} = props;

  return (
    <div className="group border-top pt-4">
      <div className="title h5 pb-2 d-flex justify-content-between align-items-center">
        <div>
          <span>{t("groups.all")}</span>
          {devices.length > 1 && (<span className="badge bg-secondary ms-2">{devices.length}</span>)}
        </div>

        <AddDeviceButton/>
      </div>
      <Row className="items">
        {devices.map((device, i) => (<Item device={device} key={i}/>))}
      </Row>
    </div>
  );
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

export default Result;
