import Web3 from 'web3';
import config from '../config/config';
import erc20Interface from '../contracts/Dai.json';
import irrigateInterface from '../contracts/Irrigate.json';

const web3 = new Web3(config.web3.localProvider);

const returnGasPrice = async () => {
  let GasPrice = parseInt(await web3.eth.getGasPrice());
  GasPrice = GasPrice + parseInt(web3.utils.toHex(web3.utils.toWei("0.1111", "gwei")));
  return GasPrice.toFixed(0);
};

const deployERC20Contract = async () => {
  console.log("starting erc20 contract local deployment");
  const owner = config.web3.owner;
  const chainId = await web3.eth.getChainId();
  const gasPrice = await returnGasPrice();
  const erc20 = await new web3.eth.Contract(erc20Interface.abi as any)
  .deploy({ data: erc20Interface.bytecode, arguments: [chainId] })
  .send({ gas: 2000000, gasPrice: gasPrice, from: owner })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("ERC20 contract successfully deployed at", receipt.contractAddress, "and gas cost is:", receipt.gasUsed)
  });
  return erc20;
};

const deployIrrigateContract = async (tokenAddress: string) => {
  console.log("starting Irrigate contract local deployment");

  const gasPrice = await returnGasPrice();
  const irrigate = await new web3.eth.Contract(irrigateInterface.abi as any)
  .deploy({ data: irrigateInterface.bytecode, arguments: [tokenAddress] })
  .send({ gas: 1500000, gasPrice: gasPrice, from: config.web3.owner })
  .on('error', error => { console.log(error) })
  .on('receipt', receipt => {
    console.log("Irrigate contract successfully deployed at", receipt.contractAddress, "and gas cost is:", receipt.gasUsed)
  });
  return irrigate;
};

const transferERC20FromIrrigate = async (dst: string, amount: number, donationId: string) => {
  const irrigateAddress = config.web3.irrigate;
  const irrigateInstance = new web3.eth.Contract(irrigateInterface.abi as any, irrigateAddress);
  let result: boolean = false;
  await irrigateInstance.methods.transferToken(dst, amount, donationId)
  .send({ from: config.web3.owner })
  .on('receipt', (receipt: any) => {
    result = true;
  })
  .on('error', (error: any) => {
    console.log(error);
    result = false;
  });
  return result;
};

const getERC20Balance = async (address: string) => {
  const erc20Address = config.web3.erc20;
  const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
  return await erc20Instance.methods.balanceOf(address).call();
};

export default {
  deployERC20Contract,
  deployIrrigateContract,
  transferERC20FromIrrigate,
  getERC20Balance
};

/*
web3.eth.sendTransaction({from: '0x123...', data: '0x432...'})
.once('sending', function(payload){ ... })
.once('sent', function(payload){ ... })
.once('transactionHash', function(hash){ ... })
.once('receipt', function(receipt){ ... })
.on('confirmation', function(confNumber, receipt, latestBlockHash){ ... })
.on('error', function(error){ ... })
.then(function(receipt){
    // will be fired once the receipt is mined
})
*/