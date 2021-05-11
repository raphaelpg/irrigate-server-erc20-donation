import 'dotenv/config';
import web3Functions from './functions/web3Functions';
import config from './config/config';

const deployContractsLocally = async () => {
  const daiAddress = config.web3.dai;
  await web3Functions.deployIrrigateContract(daiAddress);
}

deployContractsLocally();