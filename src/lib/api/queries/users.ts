import { gql } from "@apollo/client";

export const gqlGetUsers = gql`
  query Users {
    Users {
      cuid
      email
      username
    }
  }
`;

export const gqlCreateUser = gql`
  mutation CreateUser($createUserData: UserCreateInput!) {
    createUser(createUserData: $createUserData) {
      cuid
      email
      username
    }
  }
`;

export const gqlUpdateUser = gql`
  mutation UpdateUser($cuid: String!, $updateUserData: UserUpdateInput!) {
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
