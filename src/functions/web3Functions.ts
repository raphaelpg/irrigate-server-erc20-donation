import Web3 from 'web3';
import config from '../config/config';
import daiInterface from '../contracts/Dai.json';
import irrigateInterface from '../contracts/Irrigate.json';

//setup web3
const web3 = new Web3(config.web3.localProvider);

//set gas price
const returnGasPrice = async () => {
  let GasPrice = parseInt(await web3.eth.getGasPrice());
  GasPrice = GasPrice + parseInt(web3.utils.toHex(web3.utils.toWei("0.1111", "gwei")));
  return GasPrice.toFixed(0);
}

//deploy dai contract
const deployDaiContract = async () => {
  console.log("starting Dai contract local deployment");

  const chainId = await web3.eth.getChainId();
  const gasPrice = await returnGasPrice();
  const dai = await new web3.eth.Contract(daiInterface.abi as any)
  .deploy({ data: daiInterface.bytecode, arguments: [chainId] })
  .send({ gas: 2000000, gasPrice: gasPrice, from: config.web3.owner })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("Dai contract successfully deployed at", receipt.contractAddress, " and gas cost is:", receipt.gasUsed) // contains the new contract address
  });
  return dai;
};

//deploy irrigate contract
const deployIrrigateContract = async (tokenAddress: string) => {
  console.log("starting Irrigate contract local deployment");

  const gasPrice = await returnGasPrice();
  const irrigate = await new web3.eth.Contract(irrigateInterface.abi as any)
  .deploy({ data: irrigateInterface.bytecode, arguments: [tokenAddress] })
  .send({ gas: 1500000, gasPrice: gasPrice, from: config.web3.owner })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("Irrigate contract successfully deployed at", receipt.contractAddress, " and gas cost is:", receipt.gasUsed) // contains the new contract address
  });
  return irrigate;
};

const transferDai = async (dst: string, amount: string) => {
  const daiAddress = config.web3.dai;
  const daiInstance = new web3.eth.Contract(daiInterface.abi as any, daiAddress);
  let result: boolean = false;
  await daiInstance.methods.transfer(dst, amount)
  .send({ from: config.web3.owner })
  .on('receipt', (receipt: any) => {
    console.log("receipt:", receipt)
    console.log("receipt.gasUsed:", receipt.gasUsed);
    result = true;
  })
  .on('error', (error: any) => {
    console.log(error);
    result = false;
  });
  return result;
}

//subscribe to dai transfer event
const subscribeDaiTransfer = async () => {
  const daiAddress = config.web3.dai;
  const daiInstance = new web3.eth.Contract(daiInterface.abi as any, daiAddress);

  daiInstance.events.Transfer({
    filter: {dst: config.web3.irrigate},
    fromBlock: 0
  })
  .on("connected", (subscriptionId: any) => {
    console.log("Subscribed to Transfer event at:", daiAddress, ", subscriptionId:", subscriptionId);
  })
  .on('data', (event: any) => {
    console.log("transfer received:");
    console.log("From:", event.returnValues.src);
    console.log("To:", event.returnValues.dst);
    console.log("Amount:", event.returnValues.wad);
    
  })
  .on('error', (error: any) => {
    console.log(error);
  });
}

export default {
  deployDaiContract,
  deployIrrigateContract,
  transferDai,
  subscribeDaiTransfer
}