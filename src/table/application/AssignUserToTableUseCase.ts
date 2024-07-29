import { Table } from "../domain/Table";
import { TableRepository } from "../domain/TableRepository";

export class AssignUserToTableUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(tableId: number, userId: number, productIds: number[]): Promise<Table | null> {
    try {
      const table = await this.tableRepository.assignUserToTable(tableId, userId, productIds);
      return table;
    } catch (error) {
      console.error('Error assigning user to table:', error);
      return null;
    }
  }
}
