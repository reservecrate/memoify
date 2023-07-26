import { ErrorRequestHandler, Request, Response } from 'express';
import { error } from './logger.ts';

export const unknownEndpoint = (req: Request, res: Response) =>
  res.status(404).send({ error: 'unknown endpoint' });

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  error(err.message);
  if (err.name === 'CastError')
    return res
      .status(404)
      .send({ error: `${err.message} (invalid/nonexistent id)` });
  else if (err.name === 'ValidationError')
    return res.status(400).json({ error: err.message });
  else if (err.name === 'JsonWebTokenError')
    return res.status(400).json({ error: err.message });
  else if (err.name === 'Internal Server Error')
    return res.status(400).json({ error: err.message });

  next(err);
};
