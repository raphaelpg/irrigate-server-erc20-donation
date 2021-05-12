import 'dotenv/config';
import web3Functions from './functions/web3Functions';

const deployContractsLocally = async () => {
  const dai = await web3Functions.deployDaiContract();
  await web3Functions.deployIrrigateContract(dai._address);
  process.exit();
}

deployContractsLocally();