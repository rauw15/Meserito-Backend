import { TableRepository } from '../domain/TableRepository';
import TableModel, { Table as TableInterface } from '../domain/Table';
import { Model } from 'mongoose';

export class TableMongoRepository implements TableRepository {
  private tableModel: Model<TableInterface>;

  constructor() {
    this.tableModel = TableModel;
  }

  async getAll(): Promise<TableInterface[] | null> {
    try {
      const tables = await this.tableModel.find().exec();
      return tables;
    } catch (error) {
      console.error('Error fetching all tables:', error);
      return null;
    }
  }

  async createTable(
    id: number,
    color: string,
    status: string,
    numberOfClients?: number
  ): Promise<TableInterface | null> {
    try {
      const newTable = new this.tableModel({ id, color, status, numberOfClients });
      const savedTable = await newTable.save();
      return savedTable;
    } catch (error) {
      console.error('Error creating table:', error);
      return null;
    }
  }

  async getById(id: number): Promise<TableInterface | null> {
    try {
      const table = await this.tableModel.findOne({ id }).exec();
      return table;
    } catch (error) {
      console.error('Error fetching table by ID:', error);
      return null;
    }
  }

  async update(id: number, data: Partial<TableInterface>): Promise<TableInterface | null> {
    try {
      const updatedTable = await this.tableModel.findOneAndUpdate({ id }, data, { new: true }).exec();
      return updatedTable;
    } catch (error) {
      console.error('Error updating table:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.tableModel.deleteOne({ id }).exec();
      return true;
    } catch (error) {
      console.error('Error deleting table:', error);
      return false;
    }
  }

  async separateBill(tableId: number): Promise<boolean> {
    try {
      // Your logic here
      return true;
    } catch (error) {
      console.error('Error separating bill:', error);
      return false;
    }
  }

  async assignUserToTable(tableId: number, userId: number): Promise<TableInterface | null> {
    try {
      const table = await this.tableModel.findOne({ id: tableId }).exec();
      if (!table) return null;

      // Your logic to assign user here, e.g., add userId to table's user list
      table.status = `Assigned to user ${userId}`; // Example modification
      const updatedTable = await table.save();
      return updatedTable;
    } catch (error) {
      console.error('Error assigning user to table:', error);
      return null;
    }
  }
}
