import config from './config/config';
import Web3 from 'web3';
import web3Functions from './functions/web3Functions';
import transactionService from './services/transaction.services';
import daiInterface from './contracts/Dai.json';
import irrigateInterface from './contracts/Irrigate.json';
import associationService from './services/association.service';

const pendingTxChecker = async () => {
  console.log("PENDING TX CHECKER: Starting pending transactions checks...");
  const txs = await transactionService.serviceGetTx({});
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      const amountToTransfer = Math.floor(parseInt(tx.amount) - (parseInt(tx.amount) / config.params.fee));
      if (tx.currency === config.params.erc20Name) {
        const irrigateBalance = parseInt(await web3Functions.getERC20Balance(config.web3.irrigate));
        if (irrigateBalance >= amountToTransfer) {
          console.log("Transfering:", amountToTransfer, config.params.erc20Name, "to", tx.associationAddress);
          await web3Functions.transferERC20FromIrrigate(tx.associationAddress, amountToTransfer, tx.donationId);
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
  const erc20Instance = new web3.eth.Contract(daiInterface.abi as any, erc20Address);
  
  await erc20Instance.events.Transfer({
    filter: { dst: irrigateAddress },
    fromBlock: "latest"
  })
  .on("connected", () => {
    console.log("ERC20 IN LISTENER: Started");
  })
  .on('data', async (event: any) => {
    console.log("ERC20 IN LISTENER: Received", event.returnValues.wad, config.params.erc20Name, "from", event.returnValues.src);
    const tx = await transactionService.serviceGetTx({ donorAddress: event.returnValues.src, currency: config.params.erc20Name, fundsStatus: "pending" });
    if (typeof(tx[0]) != "undefined" && parseInt(tx[0].amount) <= parseInt(event.returnValues.wad)) {
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
      console.log("Funds received don't match the donation amount");
    }
  })
  .on('error', (error: any) => {
    console.log(error);
  })
}

const ERC20OUTListener = async (web3: Web3) => {
  const irrigateAddress = config.web3.irrigate;
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
      const newAmount = parseInt(targetAssociation[0].totalDaiRaised) + parseInt(event.returnValues.amount);
      const associationQuery = { "totalDaiRaised": newAmount };
      await associationService.serviceUpdateAssociation({ address: event.returnValues.dest }, associationQuery);
    })
    .catch(error => {
      console.log(error);
    })
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

const startTxProcessingEngine = async () => {
  const web3 = await new Web3(config.web3.localProvider);
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