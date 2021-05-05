import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const opts = {
  points: 100,
  duration: 1,
}

const rateLimiter = new RateLimiterMemory(opts);

const rateLimiterDDos = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter.consume(req.ip)
  .then(() => {
    next();
  })
  .catch(() => {
    res.status(429).send();
  });
}

export default rateLimiterDDos;