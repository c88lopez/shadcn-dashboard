import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

export const getUsers = gql`
  query Users {
    Users {
      cuid
      email
      username
    }
  }
`;

export const createUser = gql`
  mutation CreateUser($createUserData: UserCreateInput!) {
    createUser(createUserData: $createUserData) {
      email
      username
    }
  }
`;

export const getGraphQLClient = () =>
  new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });
