import {FormEvent} from "react";

type IAction = (arg: { [key: string]: string }) => void;

const Result = {
  handleSubmit: function handleSubmit(e: FormEvent, action: IAction) {
    e.preventDefault();

    const data: { [key: string]: string } = {};
    const inputs = e.currentTarget.getElementsByTagName("input");
    for (let i = 0; i < inputs.length; i++) {
      const input = inputs[i];
      const id = input.attributes.getNamedItem("id")?.value;
      const type = input.attributes.getNamedItem("type")?.value;
      if (!id || !type) continue;

      if (type === "checkbox") {
        data[id] = input.checked
          ? input.attributes.getNamedItem("checked_value")?.value || "true"
          : input.attributes.getNamedItem("unchecked_value")?.value || "false"
      } else {
        data[id] = input.value
      }
    }

    action(data)
  }
};

export default Result;