import web3Functions from './functions/web3Functions';
import dbAccessFunctions from './functions/dbAccessFunctions';
import transactionService from './services/transaction.services';

//launcher
//loop once
//then listen transfer
//when transfer received, loop again

//loop:
const checkPendingTx = async () => {
  //get tx list
  const txs = await transactionService.serviceGetTx();
  //check if fundsStatus received + transferStatus pending
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      const amountToTransfer = (tx.amount - (tx.amount / 100)).toString();
      console.log("transfering:", amountToTransfer, "DAI to", tx.associationAddress);
      const sendTx = await web3Functions.transferDai(tx.associationAddress, amountToTransfer);
      if (sendTx) {
        tx.transferStatus = "transferred";
        await transactionService.serviceUpdateTx({ "donorAddress": tx.donorAddress, "amount": tx.amount }, tx);
      }
    }
  }
}

export default {
  checkPendingTx
}