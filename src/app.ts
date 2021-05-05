import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import 'dotenv/config';
import router from './routes/router';
import rateLimiterDDos from './middlewares/ddosLimiter';

const app = express();
app.use('/', rateLimiterDDos);
app.use(cors());
app.use(helmet());
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

export default app;