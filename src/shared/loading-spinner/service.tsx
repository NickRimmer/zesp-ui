import {IGlobalState} from "../../global-state";

let _globalState: IGlobalState;

export interface ILoadingSpinner {
  init(globalState: IGlobalState): void;

  show(): void;

  hide(): void;
}

export default {
  init: (globalState: IGlobalState) => {
    if (_globalState) {
      console.warn("Loader spinner already initialized");
      return;
    }

    _globalState = globalState;
  },

  show: () => setVisible(true),
  hide: () => setVisible(false),
} as ILoadingSpinner

const setVisible = (isVisible: boolean): void => _globalState.setState(prev => ({...prev, ...{spinnerLoadingShow: isVisible}}));