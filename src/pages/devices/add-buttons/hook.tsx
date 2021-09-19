import {useState} from "react";
import toast from "react-hot-toast";

export default () => {
  const [showZigbeeDialog, setShowZigbeeDialog] = useState(false);

  const onAddZigbeeClockedHandler = () => {
    setShowZigbeeDialog(!showZigbeeDialog);
  }

  const onAddBleClockedHandler = () => {
    toast.success("Not implemented yet", {icon: "😅"})
  }

  return {
    onAddZigbeeClockedHandler,
    onAddBleClockedHandler,
    showZigbeeDialog,
    setShowZigbeeDialog,
  }
}