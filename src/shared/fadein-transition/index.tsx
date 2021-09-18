import React, {HTMLAttributes, useState} from "react";
import "./styles.scss";

export const FadeIn: React.FC<HTMLAttributes<HTMLDivElement>> = (props): React.ReactElement => {
  const [className, setClassName] = useState("show-transition hidden");
  setTimeout(() => setClassName("show-transition"), 0);

  return (
    <div className={`${className} ${props.className}`}>
      {props.children}
    </div>
  )
}