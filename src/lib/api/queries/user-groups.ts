import { gql } from "@apollo/client";

export const gqlGetUserGroups = gql`
  query Users {
    userGroups {
      name
    }
  }
`;

export const gqlGetUserGroupsAndUsers = gql`
  query UserGroups {
    userGroups {
      cuid
      name
      users {
        cuid
      }
    }
    users {
      cuid
      email
      username
    }
  }
`;

export const gqlCreateUserGroup = gql`
  mutation CreateUserGroup($createUserGroupData: CreateUserGroupInput!) {
    createUserGroup(createUserGroupData: $createUserGroupData) {
      cuid
    }
  }
`;

export const gqlUpdateUserGroup = gql`
  mutation UpdateUser(
    $cuid: String!
    $updateUserGroupData: UpdateUserGroupInput!
  ) {
    updateUser(cuid: $cuid, updateUserGroupData: $updateUserGroupData) {
      cuid
    }
  }
`;

export const gqlDeleteUserGroup = gql`
  mutation DeleteUserGroup($cuid: String!) {
    removeUserGroup(cuid: $cuid) {
      cuid
    }
  }
`;
