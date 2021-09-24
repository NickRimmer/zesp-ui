import {useContext, useState} from "react";
import {TypedZespResponseValidator} from "../../services/zesp/common/ZespResponseValidators";
import {DeviceInfo} from "../../models/DeviceInfo";
import {ZespContext} from "../agents/ZespAgent";
import toast from "react-hot-toast";
import {DictionaryStrings} from "../../models/DictionaryStrings";
import {useDispatch} from "react-redux";
import {updateDevice} from "../../store/slices/devicesSlice";

export default (device: DeviceInfo) => {
  const [forceClose, setForceClose] = useState(false)
  const {zespRequestAsync} = useContext(ZespContext);
  const dispatch = useDispatch();
  const fileName = `/Devices/${device.zespInfo.IEEE}`;

  const onCancelHandler = () => {
    setForceClose(true)
  }

  const onSaveHandler = (name: string | undefined, location: string | undefined) => {
    // convert empty strings to undefined
    name = name || undefined;
    location = location || undefined;

    // read current settings
    zespRequestAsync({data: `LoadJson|${fileName}`, responseValidator: TypedZespResponseValidator(fileName)})
      .then(event => {
        if (event.dataParts.length < 1) throw Error("Unexpected device settings from ZESP");
        return JSON.parse(event.dataParts[0]) as DictionaryStrings;
      })

      // send updated settings
      .then(data => {
        data["Name"] = name;
        data["Location"] = location;

        const json = JSON.stringify(data);
        return zespRequestAsync({
          data: `SaveJson|${fileName}|${json}`,
          responseValidator: TypedZespResponseValidator("ZD_RSP")
        });
      })

      // complete settings updating
      .then(event => {
        if (event.dataParts.length < 2 || event.dataParts[1].toLowerCase() !== "ok") throw Error("Cannot save device settings");

        device = {
          ...device, ...{
            zespInfo: {
              ...device.zespInfo, ...{
                Name: name,
                Location: location
              }
            }
          }
        }

        dispatch(updateDevice(device));
        setForceClose(true);
        toast.success("Settings updated");
      })

      .catch(reason => {
        toast.error("Cannot read device settings from ZESP");
        console.error(reason);
        setForceClose(true);
      });
  }

  return {
    forceClose,

    onCancelHandler,
    onSaveHandler,
  }
}