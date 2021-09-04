import React, {useState} from "react";
import {IDeviceControlProps} from "../../interfaces/IDeviceControlProps";
import {LayoutSettingsCommand} from "../settings";
import {HuePicker, GithubPicker, CompactPicker, RGBColor} from "react-color";
import {Row} from "react-bootstrap";
import {Single} from "../../services/single";
import {useLocalStorage} from "../../services/localStorage";
import {DeviceControls} from "../../services/deviceControls";
import {useGlobalState} from "../../shared/global-state-provider";
import {DeviceControlCol1, DeviceControlCol2} from "../index";

//TODO localize
export const RgbRoot = (props: IDeviceControlProps<LayoutSettingsCommand>) => {
  const globalState = useGlobalState();
  const report = DeviceControls.getControlReport(props);
  let currentValue: number[] = report?.val ? report?.val.split(":").map(x => Number(x)) : [255, 255, 255];
  if (currentValue.length !== 3) {
    console.warn(`Incorrect RGB value stored to reportd: ${report?.val}`);
    currentValue = [255, 255, 255];
  }

  const [color, setColor] = useState<RGBColor>({r: currentValue[0], g: currentValue[1], b: currentValue[2]});
  const [colorPicker, setColorPicker] = useLocalStorage("colorPicker", 1);

  const setCurrentValue = (rgb: RGBColor) => DeviceControls.setControlReport(globalState, props, `${rgb.r}:${rgb.g}:${rgb.b}`);
  const colorChangeHandler = (rgb: RGBColor) => {
    setColor(rgb);

    const [x, y] = rgbToXY(rgb);
    let command = props.config.arguments.command.replace("{x}", x.toString(16));
    command = command.replace("{y}", y.toString(16));
    Single.ZespConnector.send({data: command});
    setCurrentValue(rgb);
  }

  const sendColorHandler = () => {
    const [x, y] = rgbToXY(color);

    let command = props.config.arguments.command.replace("{x}", x.toString(16));
    command = command.replace("{y}", y.toString(16));

    Single.ZespConnector.send({data: command});
    setCurrentValue(color);
  }

  const colorPickerButton = (id: number) =>
    (<button className={`btn btn-outline-secondary me-1 btn-xs ${colorPicker == id ? "active" : ""}`} type="button" onClick={() => setColorPicker(id)}>{id}</button>)

  return (
    <Row>
      <DeviceControlCol1 className="user-select-none">
        <div>
          <div>Light color:</div>
          <div>
            {colorPickerButton(1)}
            {colorPickerButton(2)}
            {colorPickerButton(3)}
          </div>
        </div>
      </DeviceControlCol1>
      <DeviceControlCol2>
        <div className="flex-grow-1">
          {colorPicker === 1 && (<HuePicker color={color} onChange={event => setColor(event.rgb)} onChangeComplete={sendColorHandler}/>)}
          {colorPicker === 2 && (<GithubPicker color={color} onChange={event => colorChangeHandler(event.rgb)} triangle="hide" width="214px"/>)}
          {colorPicker === 3 && (<CompactPicker color={color} onChange={event => colorChangeHandler(event.rgb)}/>)}
        </div>
      </DeviceControlCol2>
    </Row>
  );
}

const rgbToXY = (rgb: RGBColor) => {
  // Apply a gamma correction to the RGB values, which makes the color more vivid and more the like the color displayed on the screen of your device
  // const red = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / (1.0 + 0.055), 2.4) : (rgb.r / 12.92);
  const red = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / (1.0 + 0.055), 2.4) : (rgb.b / 12.92);
  const green = (rgb.g > 0.04045) ? Math.pow((rgb.g + 0.055) / (1.0 + 0.055), 2.4) : (rgb.g / 12.92);
  // const blue = (rgb.b > 0.04045) ? Math.pow((rgb.b + 0.055) / (1.0 + 0.055), 2.4) : (rgb.b / 12.92);
  const blue = (rgb.r > 0.04045) ? Math.pow((rgb.r + 0.055) / (1.0 + 0.055), 2.4) : (rgb.r / 12.92);


  // RGB values to XYZ using the Wide RGB D65 conversion formula
  const X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
  const Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
  const Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;

  // Calculate the xy values from the XYZ values
  // let x = (X / (X + Y + Z)).toFixed(4);
  // let y = (Y / (X + Y + Z)).toFixed(4)
  let x = (X / (X + Y + Z));
  let y = (Y / (X + Y + Z));

  if (isNaN(x)) x = 0;
  if (isNaN(y)) y = 0;

  return [Number((x * 65279).toFixed(0)), Number((y * 65279).toFixed(0))];
}