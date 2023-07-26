import { Request, Response } from 'express';
import { Secret, JwtPayload } from 'jsonwebtoken';
import jwt from 'jsonwebtoken';
import User from '../models/user.ts';

interface IJwtPayload extends JwtPayload {
  id: string;
  username: string;
  name: string;
}

export const userExtractor = async (req: Request, res: Response) => {
  const authorisation = req.get('authorization');
  const secret = process.env.SECRET as Secret;
  if (authorisation && authorisation.startsWith('Bearer ')) {
    const decodedPayload = jwt.verify(
      authorisation.replace('Bearer ', ''),
      secret
    ) as IJwtPayload;
    if (!decodedPayload.id)
      return res.status(401).json({ error: 'invalid token' });
    const user = await User.findById(decodedPayload.id);
    return user;
  }
};
