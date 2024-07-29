import { Table } from "../domain/Table";
import { TableRepository } from "../domain/TableRepository";

export class GetAllTablesUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(): Promise<Table[] | null> {
    try {
      const tables = await this.tableRepository.getAll();
      return tables;
    } catch (error) {
      console.error('Error fetching all tables:', error);
      return null;
    }
  }
}
