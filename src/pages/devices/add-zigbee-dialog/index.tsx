import React from "react";
import useHook from "./hook";
import {AppDialog} from "../../../shared/app-dialog";
import {ProgressBar} from "react-bootstrap";

interface IProps {
  onClosed: () => void,
}

export const AddZigbeeDialog: React.FC<IProps> = ({
  onClosed
}): React.ReactElement => {

  const {
    isCompleted,
    logs
  } = useHook();

  return (
    <AppDialog title="Add Zigbee device" onClosed={onClosed} className="add-zigbee-dialog">
      {!isCompleted && (
        <>
          <p>I'm ready to pair new devices.</p>
          <ProgressBar animated={true} striped={true} now={100}/>
        </>
      )}
      {isCompleted && (
        <>
          <p>Pairing completed. To set device template or edit reports, click to device and choose <span className="badge bg-secondary">Edit</span> in settings.</p>
          <ProgressBar now={100} variant="success" label="Completed"/>
        </>
      )}
      {logs.length > 0 && (<div className="logs" dangerouslySetInnerHTML={{__html: logs}}/>)}
    </AppDialog>
  )
}

export default AddZigbeeDialog;