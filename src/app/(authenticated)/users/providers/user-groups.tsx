import React, { Dispatch, SetStateAction } from "react";
import { UserGroup } from "@vandelay-labs/schemas";

type SetUserGroups = Dispatch<SetStateAction<UserGroup[]>>;

export const UserGroupsContext = React.createContext<UserGroup[] | undefined>(
  undefined,
);
export const SetUserGroupsContext = React.createContext<
  SetUserGroups | undefined
>(undefined);

export const useUserGroupsContext = (): UserGroup[] => {
  const context = React.useContext(UserGroupsContext);

  if (context === undefined) {
    throw new Error(
      "useUserGroupsContext must be used within a UserGroupsProvider",
    );
  }

  return context;
};

export const useSetUserGroupsContext = (): SetUserGroups => {
  const context = React.useContext(SetUserGroupsContext);

  if (!context) {
    throw new Error(
      "useSetUserGroupsContext must be used within a UserGroupsProvider",
    );
  }

  return context;
};

export function UserGroupsProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [userGroups, setUserGroups] = React.useState<UserGroup[]>([]);

  return (
    <UserGroupsContext.Provider value={userGroups}>
      <SetUserGroupsContext.Provider value={setUserGroups}>
        {children}
      </SetUserGroupsContext.Provider>
    </UserGroupsContext.Provider>
  );
}
