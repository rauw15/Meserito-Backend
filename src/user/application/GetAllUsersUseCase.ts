import { User } from "../domain/User";
import { UserRepository } from "../domain/UserRepository";

export class GetAllUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async run(): Promise<User[] | null> {
    try {
      const users = await this.userRepository.getAll();
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return null;
    }
  }
}
