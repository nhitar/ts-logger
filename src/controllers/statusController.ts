import { Request, Response } from 'express';

export const getStatus = async (_: Request, res: Response) => {
  return res.status(200).json({ message: 'ok' });
};
