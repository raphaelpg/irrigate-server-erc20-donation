import Web3 from 'web3';
import { BigNumber } from "bignumber.js";
import HDWalletProvider from '@truffle/hdwallet-provider';
import config from '../config/config';
// import erc20Interface from '../contracts/Dai.json';
import erc20Interface from '../contracts/MintableERC20.json';
import irrigateInterface from '../contracts/Irrigate.json';

const getWsWeb3 = () => {
  const web3 = new Web3(config.web3.wsProvider);
  return web3;
};

const getHttpWeb3 = () => {
  const mots = config.web3.mots;
  const provider = new HDWalletProvider(mots, config.web3.httpProvider);
  const web3 = new Web3(provider);
  return web3;
}

const returnGasPrice = async () => {
  const web3 = getWsWeb3();
  let GasPrice = parseInt(await web3.eth.getGasPrice());
  GasPrice = GasPrice + parseInt(web3.utils.toHex(web3.utils.toWei("0.1111", "gwei")));
  return GasPrice.toFixed(0);
};

const deployERC20Contract = async () => {
  const web3 = getHttpWeb3();
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
  const web3 = getHttpWeb3();
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

const transferERC20FromIrrigate = async (dst: string, amount: BigNumber, donationId: string) => {
  const web3 = getHttpWeb3();
  const irrigateAddress = config.web3.irrigate;
  const irrigateInstance = new web3.eth.Contract(irrigateInterface.abi as any, irrigateAddress);
  let result: boolean = false;
  await irrigateInstance.methods.transferToken(dst, amount.toString(), donationId)
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
  const web3 = getWsWeb3();
  const erc20Address = config.web3.erc20;
  const erc20Instance = new web3.eth.Contract(erc20Interface.abi as any, erc20Address);
  return await erc20Instance.methods.balanceOf(address).call();
};

const hexToLowerCase = (item: any) => {
  if (Object.keys(item).length != 0) {
    Object.keys(item).map(key => {
      if (["address", "associationAddress", "donorAddress"].includes(key)) {
        item[key] = item[key].toLowerCase();
      }
    })
    return item;
  } else {
    return item;
  }
}

export default {
  erc20Interface,
  irrigateInterface,
  getWsWeb3,
  deployERC20Contract,
  deployIrrigateContract,
  transferERC20FromIrrigate,
  getERC20Balance,
  hexToLowerCase
};