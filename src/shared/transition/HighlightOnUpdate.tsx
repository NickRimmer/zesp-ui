import React, {FunctionComponent} from "react";
import {Transition} from "./index";

export const HighlightOnUpdate: FunctionComponent = (props) => {
  return (
    <Transition classNameFrom="highlight-value just-added" classNameTo="highlight-value" onRefresh={true} onLoad={false}>
      {props.children}
    </Transition>
  )
}