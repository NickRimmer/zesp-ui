import React from "react";

interface IProps {
  device: string,
  ieee: string,
}

export default (props: IProps) => {
  return (
    <>
      <p>Somehow we missed data for selecte device.</p>
      <p>
        <ul>
          <li>Would you so kind to refresh this page and try again?</li>
          <li>In case if you still cannot see this information, please <a
            href="https://github.com/NickRimmer/zesp-ui/issues" target={"_blank"}>let us know</a> about the problem.
          </li>
        </ul>
      </p>
      <p>
        <div className="alert alert-warning">Device: <span className="badge bg-info">{props.device}</span> <b>{props.ieee}</b></div>
      </p>
    </>
  )
}
