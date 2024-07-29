import { UserRepository } from '../domain/UserRepository';
import { User } from '../domain/User';

export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: number, name: string, password: string, email: string, role: string): Promise<User | null> {
    try {
      const user = await this.userRepository.createUser(id, name, password, email);
      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }
}
