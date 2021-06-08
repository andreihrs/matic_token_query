const {
  ApolloClient,
  gql,
  useQuery,
  InMemoryCache,
} = require("@apollo/client/core");

require("cross-fetch/polyfill");

const APIURL = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2";

const pairsQuery = `
  query {
    pairs(first: 100, orderBy: reserveUSD, orderDirection: desc, filter: {
      createdAtBlockNumber: {
        gt: 12593815
      }
    }) {
      id 
      token0
      token1
      createdAtTimestamp
      createdAtBlockNumber
      liquidityProviderCount
      volumeUSD
    }
  }
`;

const client = new ApolloClient({
  uri: APIURL,
  cache: new InMemoryCache(),
});

client
  .query({
    query: gql(pairsQuery),
    variables: {
      skip: 300,
    },
  })
  .then((data) => console.log("Subgraph data", data.data))
  .catch((err) => {
    console.log("Error fetching data: ", err);
  });
