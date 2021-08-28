import {ReactNode} from "react";

export interface IProps {
  children?: ReactNode
  onSubmit: (data: any) => void;
}