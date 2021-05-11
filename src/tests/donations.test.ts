import Web3 from 'web3';
import config from '../config/config';
import daiInterface from '../contracts/Dai.json';

const web3 = new Web3(config.web3.localProvider);

//test event emission on erc20 reception
const testERC20Transfer = async () => {
  const daiInstance = await new web3.eth.Contract(daiInterface.abi as any, config.web3.dai);
  await daiInstance.methods.mint(config.web3.owner, 10000);
  // await daiInstance.methods.transfer()
}