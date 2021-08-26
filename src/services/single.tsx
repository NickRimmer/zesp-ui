import {IZespConnector} from "./zesp/interfaces/IZespConnector";
import ZespConnectorImplementation from "./zesp/common/ZespConnector";
import LoadingSpinnerImplementation, {ILoadingSpinner} from "../shared/loading-spinner/service";

export namespace Single {
  export const ZespConnector: IZespConnector = ZespConnectorImplementation;
  export const ZespConnectorPromise: Promise<IZespConnector> = new Promise<IZespConnector>(resolve => resolve(Single.ZespConnector));
  export const Spinner: ILoadingSpinner = LoadingSpinnerImplementation;
}