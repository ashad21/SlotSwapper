import jwt from 'jsonwebtoken';

export const generateToken = (userId: string): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined');
  }
  
  return jwt.sign({ id: userId }, secret, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  } as any);
};
