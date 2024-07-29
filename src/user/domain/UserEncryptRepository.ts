import { User } from './User'; 

export interface UserEncryptRepository {
  encrypt(password: string): Promise<User[] | null>;
}
