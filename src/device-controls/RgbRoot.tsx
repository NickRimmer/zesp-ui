import React, {useState} from "react";
import {IDeviceControlProps} from "../interfaces/IDeviceControlProps";
import {LayoutSettingsRgb} from "./settings";
import {HuePicker, GithubPicker, CompactPicker, RGBColor} from "react-color";
import {Col, Row} from "react-bootstrap";
import {Single} from "../services/single";
import {useLocalStorage} from "../services/localStorage";

//TODO localize
export const RgbRoot = (props: IDeviceControlProps<LayoutSettingsRgb>) => {
  const [color, setColor] = useState<RGBColor>({r: 255, g: 255, b: 255});
  const [colorPicker, setColorPicker] = useLocalStorage("colorPicker", 1);

  const colorChangeHandler = (rgb: RGBColor) => {
    setColor(rgb);

    const [x, y] = rgbToXY(rgb);
    let command = props.config.arguments.command.replace("{x}", x.toString(16));
    command = command.replace("{y}", y.toString(16));
    Single.ZespConnector.send({data: command});
  }

  const sendColorHandler = () => {
    const [x, y] = rgbToXY(color);

    let command = props.config.arguments.command.replace("{x}", x.toString(16));
    command = command.replace("{y}", y.toString(16));

    Single.ZespConnector.send({data: command});
  }

  const colorPickerButton = (id: number) =>
    (<button className={`btn btn-outline-secondary me-1 btn-xs ${colorPicker == id ? "active" : ""}`} type="button" onClick={() => setColorPicker(id)}>{id}</button>)

  return (
    <Row>
      <Col md="3" lg="2" className="user-select-none">
        <div>
          <div>Light color:</div>
          <div>
            {colorPickerButton(1)}
            {colorPickerButton(2)}
            {colorPickerButton(3)}
          </div>
        </div>
      </Col>
      <Col>
        <div className="flex-grow-1">
          {colorPicker === 1 && (<HuePicker color={color} onChange={event => setColor(event.rgb)} onChangeComplete={sendColorHandler}/>)}
          {colorPicker === 2 && (<GithubPicker color={color} onChange={event => colorChangeHandler(event.rgb)} triangle="hide" width="214px"/>)}
          {colorPicker === 3 && (<CompactPicker color={color} onChange={event => colorChangeHandler(event.rgb)}/>)}
        </div>
      </Col>
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