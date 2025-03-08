import { ApolloClient, DocumentNode, InMemoryCache } from "@apollo/client";
import type { MutationOptions } from "@apollo/client/core/watchQueryOptions";

type QueryParams = {
  query: DocumentNode;
};

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

  public query({ query }: QueryParams) {
    return this.client.query({
      query,
    });
  }

  public mutate({ mutation, variables }: MutationOptions) {
    return this.client.mutate({
      mutation,
      variables,
    });
  }
}
