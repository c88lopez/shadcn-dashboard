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

export const getClient = () =>
  new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
  });
