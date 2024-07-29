import { Table } from "../domain/Table";
import { TableRepository } from "../domain/TableRepository";

export class UpdateTableUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(id: number, data: Partial<Table>): Promise<Table | null> {
    try {
      const updatedTable = await this.tableRepository.update(id, data);
      return updatedTable;
    } catch (error) {
      console.error('Error updating table:', error);
      return null;
    }
  }
}
