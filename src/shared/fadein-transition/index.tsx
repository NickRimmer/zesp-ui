import {FunctionComponent, useState} from "react";
import "./styles.scss";

export const FadeIn: FunctionComponent = (props) => {
  const [className, setClassName] = useState("show-transition hidden");
  setTimeout(() => setClassName("show-transition"), 0);

  return (
    <div className={className}>
      {props.children}
    </div>
  )
}