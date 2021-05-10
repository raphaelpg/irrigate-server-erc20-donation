import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import router from './routes/router';
import rateLimiterDDos from './middlewares/ddosLimiter';
import web3Functions from './functions/web3Functions';


const app = express();
app.use('/', rateLimiterDDos);
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

const deployContractsLocally = async () => {
  const dai = await web3Functions.deployDaiContract();
  const irrigate = await web3Functions.deployIrrigateContract(dai._address);
}

deployContractsLocally();

export default app;