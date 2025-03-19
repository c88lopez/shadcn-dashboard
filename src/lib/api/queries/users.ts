import { gql } from "@apollo/client";

export const gqlGetUsersAndGroups = gql`
  query Users {
    users {
      cuid
      email
      username
      groups {
        cuid
      }
    }
    userGroups {
      cuid
      name
    }
  }
`;

export const gqlCreateUser = gql`
  mutation CreateUser($createUserData: CreateUserInput!) {
    createUser(createUserData: $createUserData) {
      cuid
    }
  }
`;

export const gqlUpdateUser = gql`
  mutation UpdateUser($cuid: String!, $updateUserData: UpdateUserInput!) {
    updateUser(cuid: $cuid, updateUserData: $updateUserData) {
      cuid
    }
  }
`;

export const gqlDeleteUser = gql`
  mutation DeleteUser($cuid: String!) {
    removeUser(cuid: $cuid) {
      cuid
    }
  }
`;
