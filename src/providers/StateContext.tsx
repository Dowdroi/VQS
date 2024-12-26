import { createContext, useState } from 'react';

export interface StateContextType {
  openGlobalLoading?: (state: boolean) => void;
  isGlobalLoading?: boolean;
}

const defaultToggleContext = {
  openGlobalLoading: () => { },
  isGlobalLoading: false,
};

export const StateContext =
  createContext<StateContextType>(defaultToggleContext);

export const StateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const openGlobalLoading = (state: boolean) => {
    setIsGlobalLoading(state);
  };

  return (
    <StateContext.Provider
      value={{
        isGlobalLoading,
        openGlobalLoading,
      }}
    >
      {children}
    </StateContext.Provider>
  );
};
