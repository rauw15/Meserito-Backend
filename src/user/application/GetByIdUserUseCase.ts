import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class GetByIdUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(id: number): Promise<User | null> { // Cambiar a User | null
    try {
      const user = await this.userRepository.getById(id);
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }
}
