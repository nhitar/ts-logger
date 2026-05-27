import bcrypt from 'bcryptjs';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const users = [
  {
    id: '1',
    email: 'user@example.com',
    hash: '$2a$15$qAJGdkZhRxOpuSxIwAbgmuJgQjLDcfMBUHIeCO7W52UE5Avarv.qy',
  },
];

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret-key', {
    expiresIn: '1h',
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = users.find((user) => user.email === email);
    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return res
        .status(401)
        .json({ message: 'Email or password is incorrect.' });
    }

    const { hash, ...safeUser } = user;

    res.json({
      user: { ...safeUser },
      token: generateToken(user.id),
    });
  } catch (error) {
    res.status(500).json({ message: error });
  }
};
