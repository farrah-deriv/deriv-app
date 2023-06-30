import React from 'react';
import {TState} from "./modal-manager-context-provider"

export const ModalManagerContext = React.createContext<TState | null>(null);

export const useModalManagerContext = () => {
    const context =  React.useContext(ModalManagerContext);
    if (!context) {
        throw new Error(
            "useModalManagerContext has to be used within <ModalManagerContext.Provider>"
          );
    }
    return context;
};
