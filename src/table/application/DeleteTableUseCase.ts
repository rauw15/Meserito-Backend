import { TableRepository } from "../domain/TableRepository";

export class DeleteTableUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(id: number): Promise<boolean> {
    try {
      const result = await this.tableRepository.delete(id);
      return result;
    } catch (error) {
      console.error('Error deleting table:', error);
      return false;
    }
  }
}
