const Web3 = require("web3");
const NODE_URL = "wss://matic-mainnet-full-ws.bwarelabs.com";
const provider = new Web3.providers.WebsocketProvider(NODE_URL, {
  clientConfig: {
    maxReceivedFrameSize: 10000000000,
    maxReceivedMessageSize: 10000000000,
  },
});

const web3 = new Web3(provider);

async function getTokens() {
  let block = await web3.eth.getBlockNumber();
  console.log("Latest Polygon Block is ", block);

  await web3.eth
    .subscribe(
      "logs",
      {
        // topics: [web3.utils.sha3("Transfer(address,address,uint256)")],
        topics: [
          "0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", // nu merge "OwnershipTransferred(address, address)"
        ],
        fromBlock: 15472031, // block
      },
      (error, result) => {
        if (!error) {
          console.log("ReSULT: ", result);
        } else {
          console.log(error);
        }
      }
    )
    .on("connected", function (subscriptionId) {
      console.log(subscriptionId);
    })
    .on("data", function (log) {
      console.log(log);
    })
    .on("changed", function (log) {});
}

getTokens();

// let latestKnownBlockNumber = -1;
// let blockTime = 5000;

// // Our function that will triggered for every block
// async function processBlock(blockNumber) {
//   console.log("We process block: " + blockNumber);
//   let block = await web3.eth.getBlock(blockNumber);
//   console.log("new block :", block);
//   for (const transactionHash of block.transactions) {
//     let transaction = await web3.eth.getTransaction(transactionHash);
//     let transactionReceipt = await web3.eth.getTransactionReceipt(
//       transactionHash
//     );
//     transaction = Object.assign(transaction, transactionReceipt);
//     // console.log("Transaction: ", transactionReceipt.contractAddress);
//     // Do whatever you want here
//   }
//   latestKnownBlockNumber = blockNumber;
// }

// // This function is called every blockTime, check the current block number and order the processing of the new block(s)
// async function checkCurrentBlock() {
//   const currentBlockNumber = await web3.eth.getBlockNumber();
//   console.log(
//     "Current blockchain top: " + currentBlockNumber,
//     " | Script is at: " + latestKnownBlockNumber
//   );
//   while (
//     latestKnownBlockNumber == -1 ||
//     currentBlockNumber > latestKnownBlockNumber
//   ) {
//     await processBlock(
//       latestKnownBlockNumber == -1
//         ? currentBlockNumber
//         : latestKnownBlockNumber + 1
//     );
//   }
//   setTimeout(checkCurrentBlock, blockTime);
// }

// checkCurrentBlock();
