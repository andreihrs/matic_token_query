const Queue = require("bull");
const {
  queryDEX,
  pairsQuery_quick,
  pairsQuery_sushi,
} = require("./graphql.js");

const APIURL_QUICK =
  "https://api.thegraph.com/subgraphs/name/sameepsi/quickswap";
const APIURL_SUSHI =
  "https://api.thegraph.com/subgraphs/name/sushiswap/matic-exchange";
const APIURL_DFYN = "https://api.thegraph.com/subgraphs/name/ss-sonic/dfyn-v5";

const exchanges = {
  sushi: {
    url: APIURL_SUSHI,
    name: "sushi",
    query: pairsQuery_sushi,
  },
  quick: {
    url: APIURL_QUICK,
    name: "quick",
    query: pairsQuery_quick,
  },
  dfyn: {
    url: APIURL_DFYN,
    name: "dfyn",
    query: pairsQuery_quick,
  },
};

queryDEX(exchanges.sushi.url, exchanges.sushi.name, exchanges.sushi.query);

const sushiQueue = new Queue("Fetch Sushi Pairs latest 1000 blocks");

const sushi = exchanges.sushi;

const options = {
  delay: 600000, //10 min in ms
  attempts: 2,
};

sushiQueue.add(sushi, options);
// const dfynQueue = new Queue("Fetch Dfyn Pairs latest 1000 blocks");
// const quickQueue = new Queue("Fetch Quick Pairs latest 1000 blocks");

sushiQueue.process("*", async (job) => {
  await queryDEX(sushi.url, sushi.name, sushi.query);
});

sushiQueue.on("completed", (job) => {
  console.log("Job completed");
});
