import { UserRepository } from "../domain/UserRepository";
import { User } from "../domain/User";
import bcrypt from 'bcrypt';

export class LoginUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async run(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null; 
  }
}
