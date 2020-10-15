import React, { createContext, useContext, useReducer } from "react";

export const Context = createContext();

export const Provider = ({reducer,initState,children}) => (
    <Context.Provider value={useReducer(reducer, initState)}>
        {children}
    </Context.Provider>
);

export const useStateValue = () => useContext(Context);