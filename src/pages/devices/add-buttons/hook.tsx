import {useState} from "react";
import toast from "react-hot-toast";

export default () => {
  const [showDialog, setShowDialog] = useState(false);

  const onAddZigbeeClickedHandler = () => {
    setShowDialog(true);
  }

  const onAddBleClickedHandler = () => {
    toast.success("Not implemented yet", {icon: "😅"})
  }

  return {
    onAddZigbeeClickedHandler,
    onAddBleClickedHandler,
    showDialog,
    setShowDialog,
  }
}
