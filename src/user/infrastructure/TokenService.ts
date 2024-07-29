import jwt from 'jsonwebtoken';

const jwtSecret: string = process.env.JWT_SECRET || 'JwtSecretKey';

export interface TokenPayload {
  id: number;
  email: string;
  role: string;
  
}

export class TokenService {
  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, jwtSecret, { expiresIn: '1d' });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, jwtSecret) as TokenPayload;
    } catch (error) {
      console.error('Token verification error:', error); 
      return null;
    }
  }
}
