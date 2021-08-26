// https://jamiehaywood.medium.com/typesafe-global-state-with-typescript-react-react-context-c2df743f3ce

import React, {createContext, useState, useContext, Dispatch, SetStateAction} from "react";
import {GetDefaultGlobalStateValues, GlobalStateInterface} from "../../global-state";

const GlobalStateContext = createContext({
  state: {} as Partial<GlobalStateInterface>,
  setState: {} as Dispatch<SetStateAction<Partial<GlobalStateInterface>>>,
});

const GlobalStateProvider = (
  {
    children,
    value = {} as GlobalStateInterface,
  }: {
    children: React.ReactNode;
    value?: Partial<GlobalStateInterface>;
  }) => {

  Object.assign(value, GetDefaultGlobalStateValues(useGlobalState));
  const [state, setState] = useState(value);

  return (
    <GlobalStateContext.Provider value={{state, setState}}>
      {children}
    </GlobalStateContext.Provider>
  );
};

const useGlobalState = () => {
  const context = useContext(GlobalStateContext);
  if (!context) {
    throw new Error("useGlobalState must be used within a GlobalStateContext");
  }

  return context;
};

const DebugState = () => {
  const {state} = useGlobalState();
  return <pre>{JSON.stringify(state || {}, null, "\t")}</pre>;
};

export {GlobalStateProvider, DebugState, useGlobalState};