const {
  ApolloClient,
  gql,
  useQuery,
  InMemoryCache,
} = require("@apollo/client/core");
const fs = require("fs");
const path = require("path");
require("cross-fetch/polyfill");
const Web3 = require("web3");
const NODE_URL = "https://matic-mainnet-full-rpc.bwarelabs.com";
const provider = new Web3.providers.HttpProvider(NODE_URL);
const web3 = new Web3(provider);

const APIURL = "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap";

const pairsQuery = `
  query($blockNumber: Int!) {
    pairs(first: 100, orderBy: reserveUSD, orderDirection: desc,
      where : {
        createdAtBlockNumber_gt: $blockNumber
    }) {
      id 
      reserveUSD
      token0 {
        id
        symbol
        name
      }
      token1 {
        id
        symbol
        name
      }
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

web3.eth.getBlockNumber().then((blockResult) => {
  console.log("Latest Polygon Block is ", blockResult);
  client
    .query({
      query: gql(pairsQuery),
      variables: {
        blockNumber: blockResult - 2000,
      },
    })
    .then((data) =>
      fs.writeFileSync(
        path.resolve(__dirname, "data.json"),
        JSON.stringify(data.data)
      )
    )
    .catch((err) => {
      console.log("Error fetching data: ", err);
    });
});
