import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

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

export const getGraphQLClient = () =>
  new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });
