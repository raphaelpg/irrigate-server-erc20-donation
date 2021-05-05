import { Request, Response, NextFunction } from 'express';
import { RateLimiterMemory } from 'rate-limiter-flexible';

const options = {
  points: 100,
  duration: 60 * 2,
  blockDuration: 60 * 10,
};

const rateLimiter10 = new RateLimiterMemory(options);

export const rateLimiterSpam10 = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter10.consume(req.ip)
  .then(() => {
    next();
  })
  .catch(() => {
    res.status(429).send("Too many requests");
  });
};

const options40 = {
  points: 40,
  duration: 60 * 2,
  blockDuration: 60 * 10,
};

const rateLimiter40 = new RateLimiterMemory(options40);

export const rateLimiterSpam40 = (req: Request, res: Response, next: NextFunction) => {
  rateLimiter40.consume(req.ip)
  .then(() => {
    next();
  })
  .catch(() => {
    res.status(429).send("Too many requests");
  });
};