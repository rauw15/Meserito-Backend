import { User } from '../domain/User';
import { UserEncryptRepository } from '../domain/UserEncryptRepository';

export class EncryptPasswordUserUseCase {
  constructor(private readonly userEncryptRepository: UserEncryptRepository) {}

  async run(password: string): Promise<User | null> {
    try {
    
      const encryptedPassword = await this.userEncryptRepository.encrypt(password);

      if (encryptedPassword && encryptedPassword.length > 0) {
        // Si encryptedPassword es un array con al menos un elemento, devolvemos el primer usuario
        return encryptedPassword[0];
      } else {
     
        return null;
      }
    } catch (error) {
      console.error('Error encriptando la contraseña:', error);
      return null;
    }
  }
}
