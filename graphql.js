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

const APIURL_QUICK =
  "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap";
const APIURL_SUSHI =
  "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange";
const APIURL_DFYN = "https://api.thegraph.com/subgraphs/name/ss-sonic/dfyn-v5";

const pairsQuery_quick = `
  query($blockNumber: Int!) {
    pairs(first: 100, orderBy: createdAtTimestamp, orderDirection: desc,
      where : {
        createdAtBlockNumber_gt: $blockNumber
      }
    ) 
    {
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

const pairsQuery_sushi = `
  query($blockNumber: Int!) {
    pairs(first: 100, orderBy: timestamp, orderDirection: desc,
      where : {
        block_gt: $blockNumber
      }
    ) 
    {
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
      timestamp
      block
      liquidityProviderCount
      volumeUSD
      
    }
  }
`;

const queryDEX = (apiUrl, exchange, pairQuery) => {
  const client = new ApolloClient({
    uri: apiUrl,
    cache: new InMemoryCache(),
  });

  web3.eth.getBlockNumber().then((blockResult) => {
    console.log("Latest Polygon Block is ", blockResult);
    client
      .query({
        query: gql(pairQuery),
        variables: {
          blockNumber: blockResult - 10000,
        },
      })
      .then((data) => {
        console.log(data.data);
        fs.writeFileSync(
          path.resolve(__dirname, "data-" + `${exchange}` + ".json"),
          JSON.stringify(data.data)
        );
      })
      .catch((err) => {
        console.log("Error fetching data: ", err);
      });
  });
};

queryDEX(APIURL_SUSHI, "sushi", pairsQuery_sushi);
queryDEX(APIURL_QUICK, "quick", pairsQuery_quick);
queryDEX(APIURL_DFYN, "dfyn", pairsQuery_quick);
