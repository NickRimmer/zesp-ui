import {useHistory} from "react-router-dom";
import React, {useEffect} from "react";
import toast from "react-hot-toast";

export default () => {
  const history = useHistory();
  useEffect(() => {
    history.push("/devices");
    toast.error("Device information not found");
  }, []);
  return (<></>);
}