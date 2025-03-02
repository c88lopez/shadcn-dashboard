import { ApolloClient, InMemoryCache } from "@apollo/client";

export default class ApiClient {
  private client: ApolloClient<any>;

  constructor(accessToken: string) {
    this.client = this.getGraphQLClient(accessToken);
  }

  private getGraphQLClient = (accessToken: string) => {
    return new ApolloClient({
      uri: "http://localhost:3001/graphql",
      cache: new InMemoryCache(),
      headers: {
        authorization: `Bearer ${accessToken}`,
      },
    });
  };

  public async query({ query }) {
    const result = await this.client.query({
      query,
    });

    return result;
  }

  public async mutate({ mutation, variables }) {
    this.client.mutate({
      mutation,
      variables,
    });
  }
}
