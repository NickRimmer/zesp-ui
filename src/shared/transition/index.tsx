import React, {ReactNode, useEffect, useState} from "react";

interface IProps {
  children?: ReactNode | undefined,
  classNameFrom: string,
  classNameTo: string,
  timeOutMs?: number,
  onRefresh?: boolean,
  onLoad?: boolean
}

export const Transition = (props: IProps) => {
  const [className, setClassName] = useState<string>();
  if (props.onRefresh === true) useEffect(() => setClassName(props.classNameFrom), [props.children]);
  if (props.onLoad === false) useEffect(() => setClassName(props.classNameTo), []);

  setTimeout(() => setClassName(props.classNameTo), props.timeOutMs || 100);
  return (<span className={className}>{props.children}</span>)
}