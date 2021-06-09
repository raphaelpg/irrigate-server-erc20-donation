import config from './config/config';
import Web3 from 'web3';
import { BigNumber } from "bignumber.js";
import web3Functions from './functions/web3Functions';
import transactionService from './services/transaction.services';
// import daiInterface from './contracts/Dai.json';
// import irrigateInterface from './contracts/Irrigate.json';
import associationService from './services/association.services';

const pendingTxChecker = async () => {
  console.log("PENDING TX CHECKER: Starting pending transactions checks...");
  const txs = await transactionService.serviceGetTx({});
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      console.log("1")
      const amount = new BigNumber(tx.amount);
      console.log("amount", amount)
      // const amount = BigInt(tx.amount);
      const fee = amount.dividedBy(new BigNumber(config.params.fee));
      console.log("fee", fee)
      // const fee = amount / new BigNumber(config.params.fee);
      const amountToTransfer = (amount.minus(fee));
      console.log("amountToTransfer", amountToTransfer)
      if (tx.currency === config.params.erc20Name) {
        console.log("2")
        
        const irrigateBalance = new BigNumber(await web3Functions.getERC20Balance(config.web3.irrigate));
        console.log("irrigateBalance", irrigateBalance)
        console.log("irrigateBalance >= amountToTransfer", irrigateBalance >= amountToTransfer)
        // const irrigateBalance = parseInt(await web3Functions.getERC20Balance(config.web3.irrigate));
        if (irrigateBalance.minus(amountToTransfer) >= new BigNumber("0")) {
        // if (irrigateBalance >= amountToTransfer) {
          console.log("3")
          
          console.log("Transfering:", amountToTransfer, config.params.erc20Name, "to", tx.associationAddress);
          const donationId = (tx.donationId).toString();
          await web3Functions.transferERC20FromIrrigate(tx.associationAddress, amountToTransfer, donationId);
        }
      }
    }
  }
  console.log("PENDING TX CHECKER: Pending transactions checks ended");
  return;
}

const ERC20INListener = async (web3: Web3) => {
  const irrigateAddress = config.web3.irrigate;
  const erc20Address = config.web3.erc20;
  const daiInterface = web3Functions.erc20Interface;
  const erc20Instance = new web3.eth.Contract(daiInterface.abi as any, erc20Address);
  
  await erc20Instance.events.Transfer({
    filter: { dst: irrigateAddress },
    fromBlock: "latest"
  })
  .on("connected", () => {
    console.log("ERC20 IN LISTENER: Started");
  })
  .on('data', async (event: any) => {
    console.log(event)
    let eventSender = event.returnValues[0];
    let eventValue = event.returnValues[2];
    console.log("ERC20 IN LISTENER: Received", eventValue, config.params.erc20Name, "from", eventSender);
    const donorAddress = (eventSender).toLowerCase();
    const currency = config.params.erc20Name;
    const tx = await transactionService.serviceGetTx({ donorAddress: donorAddress, currency: currency, fundsStatus: "pending" })
    if (typeof(tx[0]) != "undefined" && parseInt(tx[0].amount) <= parseInt(eventValue)) {
      const associations = await associationService.serviceGetAssociations({ address: tx[0].associationAddress });
      if (typeof(associations[0]) != "undefined") {
        const query = { "fundsStatus": "received" };
        await transactionService.serviceUpdateTx(tx[0], query)
        .then(async () => {
          await pendingTxChecker();
        })
        .catch(error => {
          console.log(error);
        })
      } else {
        console.log("Association address not found in the list");
      }
    } else {
      console.log("Not enough funds received");
    }
  })
  .on('error', (error: any) => {
    console.log("listener in error:", error);
  })
}

const ERC20OUTListener = async (web3: Web3) => {
  const irrigateAddress = config.web3.irrigate;
  const irrigateInterface = web3Functions.irrigateInterface;
  const irrigateInstance = new web3.eth.Contract(irrigateInterface.abi as any, irrigateAddress);
  
  await irrigateInstance.events.TokenTransfer({ fromBlock: "latest" })
  .on("connected", () => {
    console.log("ERC20 OUT LISTENER: Started");
    pendingTxChecker();
  })
  .on('data', async (event: any) => {
    console.log("ERC20 OUT LISTENER:", event.returnValues.amount, "transferred to", event.returnValues.dest)
    const filter = { donationId: event.returnValues.donationId };
    const txQuery = { "transferStatus": "transferred" };
    await transactionService.serviceUpdateTx(filter, txQuery)
    .then(async () => {
      const targetAssociation = await associationService.serviceGetAssociations({ address: event.returnValues.dest });
      const newAmount = BigInt(targetAssociation[0].totalDaiRaised) + BigInt(event.returnValues.amount);
      const associationQuery = { "totalDaiRaised": newAmount.toString() };
      await associationService.serviceUpdateAssociation({ address: event.returnValues.dest }, associationQuery);
    })
    .catch(error => {
      console.log(error);
    })
  })
  .on('error', (error: any) => {
    console.log("listener out error:", error);
    startTxProcessingEngine();
  });
}

const startTxProcessingEngine = async () => {
  const web3 = web3Functions.getWsWeb3();
  await web3.eth.net.isListening()
  .then(async () => {
    console.log('Connected to a node');
    ERC20OUTListener(web3);
  }).then(() => {
    ERC20INListener(web3);
  }).catch((e) => {
    console.log('Lost connection to the node, reconnecting');
    setTimeout(() => {
      startTxProcessingEngine()
    }, 1000);
  })
}

export default {
  startTxProcessingEngine
}