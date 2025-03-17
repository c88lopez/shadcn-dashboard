import React, { Dispatch, SetStateAction } from "react";
import { Team } from "@vandelay-labs/schemas";

type SetTeams = Dispatch<SetStateAction<Team[]>>;

export const TeamsContext = React.createContext<Team[] | undefined>(undefined);
export const SetTeamsContext = React.createContext<SetTeams | undefined>(
  undefined,
);

export const useTeamsContext = (): Team[] => {
  const context = React.useContext(TeamsContext);

  if (context === undefined) {
    throw new Error("useTeamsContext must be used within a TeamsProvider");
  }

  return context;
};

export const useSetTeamsContext = (): SetTeams => {
  const context = React.useContext(SetTeamsContext);

  if (!context) {
    throw new Error("useSetTeamsContext must be used within a TeamsProvider");
  }

  return context;
};

export function TeamsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [team, setTeams] = React.useState<Team[]>([]);

  return (
    <TeamsContext.Provider value={team}>
      <SetTeamsContext.Provider value={setTeams}>
        {children}
      </SetTeamsContext.Provider>
    </TeamsContext.Provider>
  );
}
