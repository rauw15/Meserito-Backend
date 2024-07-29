import { UserRepository } from "../domain/UserRepository";

export class DeleteUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async run(id: number): Promise<boolean> {
    const user = await this.userRepository.getById(id);
    if (!user) {
      return false; 
    }

    // Elimina el usuario
    await this.userRepository.deleteUser(id);
    return true; // Retorna true si la eliminación fue exitosa
  }
}
