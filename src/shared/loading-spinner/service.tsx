export interface ILoadingSpinner {
  init(): void;

  show(): void;

  hide(): void;
}

export default {
  init: () => {
    // if (_globalState) {
    //   console.warn("Loader spinner already initialized");
    //   return;
    // }
    //
    // _globalState = globalState;
  },

  show: () => setVisible(true),
  hide: () => setVisible(false),
} as ILoadingSpinner

const setVisible = (isVisible: boolean): void => {
  //_globalState.setState(prev => ({...prev, ...{spinnerLoadingShow: isVisible}}));
  console.log("spinner disabled");
}