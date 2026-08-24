import { type Request, type Response, type NextFunction } from 'express';

export const errorMiddleware = (error: unknown, _req: Request, res: Response, next: NextFunction) => {
  if (error instanceof Error) {
    res.status(400).send({ error: error.message });
  } else {
    next(error);
  }
};
