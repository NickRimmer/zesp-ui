import React from "react";
import ItemImage from "./item-image";
import {NavLink} from "react-router-dom";
import {DeviceInfo} from "../../models/DeviceInfo";
import HomeAutoClusters from "../../data/zigbee/ha-cluster-ids.json";
import {DataClusterInfo} from "../../models/DataClusterInfo";
import {Devices} from "../../services/devices";

interface IProps {
  device: DeviceInfo
}

export default (props: IProps) => {
  const zespInfo = props.device.zespInfo;
  const title = zespInfo.Name && zespInfo.Name.length > 0 ? zespInfo.Name : props.device.zespInfo.ModelId
  const detailsLink = `/devices/${zespInfo.IEEE}-${zespInfo.Device}`;

  let tags: string[] = [];
  for (const key of Object.keys(zespInfo.Report)) {
    const reportKeyDetails = Devices.getReportKeyDetails(key);
    const clusterInfo = HomeAutoClusters.find(x => x.clusterId === reportKeyDetails.clusterId) as DataClusterInfo | undefined
    tags.push(clusterInfo?.name || reportKeyDetails.clusterId);
  }

  // remove duplicates
  tags = tags
    .filter((x, i) => tags.indexOf(x) == i)
    .sort((a, b) => a > b ? 1 : -1);

  return (
    <NavLink className="item p-3 border rounded" to={detailsLink}>
      <div className="d-flex">
        <div><ItemImage device={props.device}/></div>
        <div className="ps-2">
          <div className="title">{title}</div>
          <div className="ieee text-muted small"><span className="badge bg-info me-1">{zespInfo.Device}</span>{zespInfo.IEEE}</div>
          {tags.length > 0 && (
            <div className="badges small">
              {tags.map((x, i) => (<span key={i} className="badge bg-secondary">{x}</span>))}
            </div>
          )}
        </div>
      </div>
    </NavLink>
  );
}