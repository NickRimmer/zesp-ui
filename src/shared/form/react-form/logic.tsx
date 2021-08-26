import {FormEvent} from "react";
import $ from "jquery";

// we need this 'any' type to provide general solution
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type IAction = (arg: any) => Promise<void>;

const Result = {
  handleSubmit: function handleSubmit(e: FormEvent, action: IAction) {
    e.preventDefault();

    // we need this 'any' type to provide general solution
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = {};

    for (const input of $(e.target).find("input")) {
      const id = $(input).prop("id");
      if (id == null) return;

      if ($(input).prop("type") == "checkbox") {
        if ($(input).prop("checked") === true) data[id] = $(input).attr("checked_value") || "true";
        else data[id] = $(input).attr("unchecked_value") || "false";
      } else {
        data[id] = $(input).val();
      }
    }
    // console.log(data);
    action(data)
  }
};

export default Result;