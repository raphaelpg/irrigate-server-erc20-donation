import config from './config/config';
import Web3 from 'web3';
import web3Functions from './functions/web3Functions';
import transactionService from './services/transaction.services';
import daiInterface from './contracts/Dai.json';
import irrigateInterface from './contracts/Irrigate.json';
import associationService from './services/association.service';

const checkPendingTx = async () => {
  console.log("Starting pending transactions checks...");
  const txs = await transactionService.serviceGetTx();
  for (const tx of txs) {
    if (tx.fundsStatus === "received" && tx.transferStatus === "pending") {
      const amountToTransfer = (tx.amount - (tx.amount / config.params.fee));
      if (tx.currency === config.params.erc20Name) {
        const irrigateBalance = parseInt(await web3Functions.getERC20Balance(config.web3.irrigate));
        if (irrigateBalance >= amountToTransfer) {
          console.log("transfering:", amountToTransfer, config.params.erc20Name, "to", tx.associationAddress);
          await web3Functions.transferERC20FromIrrigate(tx.associationAddress, amountToTransfer.toString(), tx.donationId);
        }
      }
    }
  }
  console.log("Pending transactions checks ended");
  return;
}

const ERC20ReceivedListener = async (web3: Web3) => {
  const irrigateAddress = config.web3.irrigate;
  const erc20Address = config.web3.erc20;
  const erc20Instance = new web3.eth.Contract(daiInterface.abi as any, erc20Address);
  
  await erc20Instance.events.Transfer({
    filter: { dst: irrigateAddress },
    fromBlock: "latest"
  })
  .on("connected", () => {
    console.log("ERC20 IN listener to Irrigate contract started");
  })
  .on('data', async (event: any) => {
    const filter = { donorAddress: event.returnValues.src, amount: event.returnValues.wad , currency: config.params.erc20Name };
    const query = { "fundsStatus": "received" };
    await transactionService.serviceUpdateTx(filter, query)
    .then(async () => {
      await checkPendingTx();
    })
    .then(() => {
      ERC20ReceivedListener(web3);
    })
    .catch(error => {
      console.log(error);
      ERC20ReceivedListener(web3);
    })
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

const ERC20SentListener = async (web3: Web3) => {
  const irrigateAddress = config.web3.irrigate;
  const irrigateInstance = new web3.eth.Contract(irrigateInterface.abi as any, irrigateAddress);
  
  await irrigateInstance.events.TokenTransfer({ fromBlock: "latest" })
  .on("connected", () => {
    console.log("ERC20 OUT listener from Irrigate contract started");
  })
  .on('data', async (event: any) => {
    const filter = { donationId: event.returnValues.donationId };
    const txQuery = { "transferStatus": "transferred" };
    await transactionService.serviceUpdateTx(filter, txQuery)
    .then(async () => {
      const targetAssociation = await associationService.serviceGetAssociationByFilter({ address: event.returnValues.dest });
      const newAmount = parseInt(targetAssociation[0].totalDaiRaised) + parseInt(event.returnValues.amount);
      const associationQuery = { "totalDaiRaised": newAmount };
      await associationService.serviceUpdateAssociation({ address: event.returnValues.dest }, associationQuery);
    })
    .then(() => {
      ERC20SentListener(web3);
    })
    .catch(error => {
      console.log(error);
      ERC20SentListener(web3);
    })
  })
  .on('error', (error: any) => {
    console.log(error);
    startTxProcessingEngine();
  });
}

const startTxProcessingEngine = async () => {
  const web3 = await new Web3(config.web3.localProvider);
  await web3.eth.net.isListening()
  .then(async () => {
    console.log('Connected to a node');
    await checkPendingTx();
    ERC20ReceivedListener(web3);
    ERC20SentListener(web3);
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