import { Table } from "../domain/Table";
import { TableRepository } from "../domain/TableRepository";

export class CreateTableUseCase {
  constructor(private readonly tableRepository: TableRepository) {}

  async run(id: number, color: string, status: string, numberOfClients?: number): Promise<Table | null> {
    try {
      const table = await this.tableRepository.createTable(id, color, status, numberOfClients);
      return table;
    } catch (error) {
      console.error('Error creating table:', error);
      return null;
    }
  }
}
