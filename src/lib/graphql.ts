import { ApolloClient, gql, InMemoryCache } from "@apollo/client";

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

const auxToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQHZhbmRlbGF5LWxhYnMuY29tIiwic3ViIjoiY203b2ExNzhuMDAwMDFidTVpbzFnZTJjbiIsInVzZXJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3NDA3MjE3NDksImV4cCI6MTc0MDcyNTM0OX0.u97ol1wFOZ-Wcru732Me2y3ssJHZcGdAcjviu5emIeA";

export const getGraphQLClient = () =>
  new ApolloClient({
    uri: "http://localhost:3001/graphql",
    cache: new InMemoryCache(),
    headers: {
      authorization: `Bearer ${auxToken}`,
    },
  });
