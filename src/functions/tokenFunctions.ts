import { Response } from 'express';
import config from '../config/config';
import jwt from 'jsonwebtoken';
import IUser from '../interfaces/user';

const jwtSecret = config.jwt.jwtSecret;
const expirationTimeInSeconds = config.jwt.expirationTimeInSeconds;

const sign: (query: IUser) => string = (query) => {
  return jwt.sign({ email: query.email }, jwtSecret, { algorithm: 'HS256', expiresIn: expirationTimeInSeconds });
};

const verify = (token: string, callback: (error: any, decoded: any) => Response<any, Record<string, any>> | undefined) => {
  return jwt.verify(token, jwtSecret, callback);
};

export default {
  sign,
  verify
};