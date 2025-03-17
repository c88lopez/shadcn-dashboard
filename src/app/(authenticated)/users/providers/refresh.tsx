import React, { Dispatch, SetStateAction } from "react";

type SetRefresh = Dispatch<SetStateAction<boolean>>;

export const RefreshContext = React.createContext<boolean | undefined>(
  undefined,
);
export const SetRefreshContext = React.createContext<SetRefresh | undefined>(
  undefined,
);

export const useRefreshContext = (): boolean => {
  const context = React.useContext(RefreshContext);

  if (context === undefined) {
    throw new Error("useRefreshContext must be used within a RefreshProvider");
  }

  return context;
};

export const useSetRefreshContext = (): SetRefresh => {
  const context = React.useContext(SetRefreshContext);

  if (!context) {
    throw new Error(
      "useSetRefreshContext must be used within a RefreshProvider",
    );
  }

  return context;
};

export function RefreshProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [refresh, setRefresh] = React.useState<boolean>(false);

  return (
    <RefreshContext.Provider value={refresh}>
      <SetRefreshContext.Provider value={setRefresh}>
        {children}
      </SetRefreshContext.Provider>
    </RefreshContext.Provider>
  );
}
