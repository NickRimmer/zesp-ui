import {IZespConnector} from "./zesp/interfaces/IZespConnector";
import ZespConnectorImplementation from "./zesp/common/ZespConnector";

export namespace Single {
  export const ZespConnector: IZespConnector = ZespConnectorImplementation;
  export const ZespConnectorPromise: Promise<IZespConnector> = new Promise<IZespConnector>(resolve => resolve(Single.ZespConnector));
}