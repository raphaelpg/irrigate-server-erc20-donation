import config from './config/config';
import Web3 from 'web3';
import web3Functions from './functions/web3Functions';
import transactionService from './services/transaction.services';
import daiInterface from './contracts/Dai.json';
import irrigateInterface from './contracts/Irrigate.json';

const checkPendingTx = async () => {
  console.log("Starting pending transactions checks...");
  const txs = await transactionService.serviceGetTx();
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      const amountToTransfer = (tx.amount - (tx.amount / 100));
      const irrigateBalance = parseInt(await web3Functions.getDaiBalance(config.web3.irrigate));
      if (irrigateBalance >= amountToTransfer) {
        console.log("transfering:", amountToTransfer, "DAI to", tx.associationAddress);
        await web3Functions.transferDaiFromIrrigate(tx.associationAddress, amountToTransfer.toString(), tx.donationId);
        return;
      }
    }
  }
  console.log("Pending transactions checks ended");
  return;
}

const ERC20ReceivedListener = async () => {
  const web3 = new Web3(config.web3.localProvider);
  const irrigateAddress = config.web3.irrigate;
  const daiAddress = config.web3.dai;
  const daiInstance = new web3.eth.Contract(daiInterface.abi as any, daiAddress);
  
  await daiInstance.events.Transfer({
    filter: { dst: irrigateAddress },
    fromBlock: "latest"
  })
  .on("connected", (subscriptionId: any) => {
    console.log("ERC20 Receiving listener at Irrigate contract started");
  })
  .on('data', async (event: any) => {
    const filter = { donorAddress: event.returnValues.src, amount: event.returnValues.wad };
    const query = { "fundsStatus": "received" };
    await transactionService.serviceUpdateTx(filter, query)
    .then(() => {
      checkPendingTx();
    })
    .then(() => {
      ERC20ReceivedListener();
    })
    .catch(error => {
      console.log(error);
      ERC20ReceivedListener();
    })
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

const ERC20SentListener = async () => {
  const web3 = new Web3(config.web3.localProvider);
  const irrigateAddress = config.web3.irrigate;
  const irrigateInstance = new web3.eth.Contract(irrigateInterface.abi as any, irrigateAddress);
  
  await irrigateInstance.events.TokenTransfer({ fromBlock: "latest" })
  .on("connected", (subscriptionId: any) => {
    console.log("ERC20 Sending listener from Irrigate contract started");
  })
  .on('data', async (event: any) => {
    const filter = { donationId: event.returnValues.donationId };
    const query = { "transferStatus": "transferred" };
    await transactionService.serviceUpdateTx(filter, query)
    .then(() => {
      ERC20SentListener();
    })
    .catch(error => {
      console.log(error);
      ERC20SentListener();
    })
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

const startTxProcessingEngine = async () => {
  await checkPendingTx();
  ERC20ReceivedListener();
  ERC20SentListener();
}

export default {
  startTxProcessingEngine
}