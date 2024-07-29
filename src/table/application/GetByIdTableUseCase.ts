import { Table } from "../domain/Table";
import { TableRepository } from "../domain/TableRepository";

export class GetByIdTableUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(id: number): Promise<Table | null> {
    try {
      const table = await this.tableRepository.getById(id);
      return table;
    } catch (error) {
      console.error('Error fetching table by ID:', error);
      return null;
    }
  }
}
