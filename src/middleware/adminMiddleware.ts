/// <reference path="../../@types/express.d.ts" />
// src/middleware/adminMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import { authMiddleware } from './authMiddleware'; // Asegúrate de que la ruta sea correcta
import { TokenPayload } from '../user/infrastructure/TokenService'; // Asegúrate de que la ruta sea correcta

export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  authMiddleware(req, res, () => {
    const user = (req as any).user as TokenPayload;

    if (user.role !== 'admin' && user.role !== 'administrador') {
      return res.status(403).send({ status: 'error', message: 'Access denied' });
    }

    next();
  });
};
