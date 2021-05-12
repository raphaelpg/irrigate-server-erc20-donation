import config from './config/config';
import Web3 from 'web3';
import web3Functions from './functions/web3Functions';
import transactionService from './services/transaction.services';
import daiInterface from './contracts/Dai.json';

const checkPendingTx = async () => {
  console.log("Starting pending transactions check...");
  const txs = await transactionService.serviceGetTx();
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      const amountToTransfer = (tx.amount - (tx.amount / 100)).toString();
      console.log("transfering:", amountToTransfer, "DAI to", tx.associationAddress);
      const sendTx = await web3Functions.transferDaiFromIrrigate(tx.associationAddress, amountToTransfer);
      if (sendTx) {
        tx.transferStatus = "transferred";
        await transactionService.serviceUpdateTx({ "donorAddress": tx.donorAddress, "amount": tx.amount }, tx);
      }
    }
  }
  console.log("No pending transactions");
  return;
}

const listenToTransfer = async () => {
  console.log("Listening to transfer event");
  
  const web3 = new Web3(config.web3.localProvider);
  const irrigateAddress = config.web3.irrigate;
  const daiAddress = config.web3.dai;
  const daiInstance = new web3.eth.Contract(daiInterface.abi as any, daiAddress);
  
  await daiInstance.events.Transfer({
    filter: { dst: irrigateAddress },
    fromBlock: "latest"
  })
  .on("connected", (subscriptionId: any) => {
    console.log("Subscribed to Transfer events to:", irrigateAddress, " at:", daiAddress, ", subscriptionId:", subscriptionId);
  })
  .on('data', async (event: any) => {
    //verif si tx existe dans db et si pending
    const filter = { donorAddress: event.returnValues.src, amount: event.returnValues.wad };
    const query = { "fundsStatus": "received" };
    await transactionService.serviceUpdateTx(filter, query)
    .then(() => {
      checkPendingTx();
    })
    .then(() => {
      listenToTransfer();
    })
    .catch(error => {
      console.log(error);
      listenToTransfer();
    })
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

const startTxProcessingEngine = async () => {
  await checkPendingTx()
  .then(() => {
    listenToTransfer();
  })
  // setTimeout(() => {
  //   listenToTransfer();  
  // }, 30000);
}

export default {
  startTxProcessingEngine
}