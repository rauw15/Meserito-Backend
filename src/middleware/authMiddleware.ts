// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { TokenPayload } from '../user/infrastructure/TokenService'; // Asegúrate de que la ruta sea correcta

const jwtSecret: string = process.env.JWT_SECRET || 'JwtSecretKey';

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ status: 'error', message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, jwtSecret) as TokenPayload;
    req.user = decoded; 
    next();
  } catch (error) {
    return res.status(401).send({ status: 'error', message: 'Invalid token' });
  }
};
