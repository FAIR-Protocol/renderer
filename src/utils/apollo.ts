import { ApolloClient, InMemoryCache } from "@apollo/client";

const NET_ARWEAVE_URL = 'https://arweave.net';

export const client = new ApolloClient({
  uri: NET_ARWEAVE_URL + '/graphql',
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'cache-first',
      errorPolicy: 'all',
    },
  },
});
