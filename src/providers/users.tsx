import React, { Dispatch, SetStateAction } from "react";
import { User } from "@vandelay-labs/schemas";

type SetUsers = Dispatch<SetStateAction<User[]>>;

export const UsersContext = React.createContext<User[] | undefined>(undefined);
export const SetUsersContext = React.createContext<SetUsers | undefined>(
  undefined,
);

export const useUsersContext = (): User[] => {
  const context = React.useContext(UsersContext);

  if (context === undefined) {
    throw new Error("useUsersContext must be used within a UsersProvider");
  }

  return context;
};

export const useSetUsersContext = (): SetUsers => {
  const context = React.useContext(SetUsersContext);

  if (!context) {
    throw new Error("useSetUsersContext must be used within a UsersProvider");
  }

  return context;
};

export function UsersProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [users, setUsers] = React.useState<User[]>([]);

  return (
    <UsersContext.Provider value={users}>
      <SetUsersContext.Provider value={setUsers}>
        {children}
      </SetUsersContext.Provider>
    </UsersContext.Provider>
  );
}
