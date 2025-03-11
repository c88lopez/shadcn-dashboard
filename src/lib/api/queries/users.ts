import { gql } from "@apollo/client";

export const gqlGetUsers = gql`
  query Users {
    users {
      cuid
      email
      username
    }
  }
`;

export const gqlGetUsersAndTeams = gql`
  query Users {
    users {
      cuid
      email
      username
      teams {
        cuid
        name
      }
    }
    teams {
      cuid
      name
    }
  }
`;

export const gqlCreateUser = gql`
  mutation CreateUser($createUserData: CreateUserInput!) {
    createUser(createUserData: $createUserData) {
      cuid
      email
      username
    }
  }
`;

export const gqlUpdateUser = gql`
  mutation UpdateUser($cuid: String!, $updateUserData: UpdateUserInput!) {
    updateUser(cuid: $cuid, updateUserData: $updateUserData) {
      cuid
      email
      username
    }
  }
`;

export const gqlDeleteUser = gql`
  mutation DeleteUser($cuid: String!) {
    deleteUser(cuid: $cuid) {
      cuid
    }
  }
`;
