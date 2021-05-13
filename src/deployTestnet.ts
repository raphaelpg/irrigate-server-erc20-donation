import 'dotenv/config';
import web3Functions from './functions/web3Functions';
import config from './config/config';

const deployContractsLocally = async () => {
  const erc20Address = config.web3.erc20;
  await web3Functions.deployIrrigateContract(erc20Address);
  process.exit();
}

deployContractsLocally();