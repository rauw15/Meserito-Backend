import { TokenPayload } from '../user/infrastructure/TokenService';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}
