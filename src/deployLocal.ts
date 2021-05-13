import 'dotenv/config';
import web3Functions from './functions/web3Functions';

const deployContractsLocally = async () => {
  const erc20: any = await web3Functions.deployERC20Contract();
  await web3Functions.deployIrrigateContract(erc20._address);
  process.exit();
}

deployContractsLocally();