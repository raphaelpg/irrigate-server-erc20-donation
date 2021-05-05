import { Request, Response, NextFunction } from 'express';
import tokenFunctions from '../functions/tokenFunctions';

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  let token = req.headers.authorization?.split(' ')[1];

  if (token) {
      tokenFunctions.verify(token, (error, decoded) => {
        if (error) {
          return res.status(404).json({ msg: error.message, error })
        } else {
          res.locals.jwt = decoded;
          next();
      }
    });
  } else {
    return res.status(401).json({ msg: "Unauthorized" });
  };
};

export default checkAuth;