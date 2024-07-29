import { Table } from "./Table";

export interface TableRepository {
  getAll(): Promise<Table[] | null>;
  createTable(id: number, color: string, status: string, numberOfClients?: number): Promise<Table | null>;
  getById(id: number): Promise<Table | null>;
  update(id: number, data: Partial<Table>): Promise<Table | null>;
  delete(id: number): Promise<boolean>;
  separateBill(tableId: number): Promise<boolean>;
  assignUserToTable(tableId: number, userId: number, productIds: number[]): Promise<Table | null>;
}
