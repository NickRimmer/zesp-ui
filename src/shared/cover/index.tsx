import React, {FunctionComponent} from "react";

const Result: FunctionComponent = (props) => {
  return (
    <div className="cover text-center d-flex content-light align-self-center flex-grow-1 align-items-center">
      <div className="">
        {props.children}
      </div>
    </div>
  );
}

export default Result;