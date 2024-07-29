import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";

export class UpdateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async run(id: number, name?: string, email?: string): Promise<User | null> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      return null; 
    }

    
    user.name = name || user.name;
    user.email = email || user.email;

    
    await this.userRepository.updateUser(user);
    return user; 
  }
}
