import { TableRepository } from "../domain/TableRepository";

export class SeparateBillUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(tableId: number): Promise<boolean> {
    try {
      const result = await this.tableRepository.separateBill(tableId);
      return result;
    } catch (error) {
      console.error('Error separating bill:', error);
      return false;
    }
  }
}
