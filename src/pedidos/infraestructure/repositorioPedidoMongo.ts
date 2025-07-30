import { Model } from 'mongoose';
import { Pedido } from '../domain/Pedido';
import PedidoModel from '../domain/Pedido'; // Modelo de Mongoose para Pedido
import { PedidoRepository, PedidoFilters } from '../domain/PedidoRepository';

export class PedidoMongoRepository implements PedidoRepository {
  private pedidoModel: Model<Pedido>;

  constructor() {
    this.pedidoModel = PedidoModel;
  }

  async getAll(): Promise<Pedido[] | null> {
    try {
      const pedidos = await this.pedidoModel.find().exec();
      return pedidos;
    } catch (error) {
      console.error('Error fetching all pedidos:', error);
      return null;
    }
  }

  async getFiltered(filters: PedidoFilters): Promise<Pedido[] | null> {
    try {
      const query: any = {};
      
      if (filters.status) {
        query.status = filters.status;
      }
      
      if (filters.userId !== undefined) {
        query.userId = filters.userId;
      }
      
      if (filters.table_id !== undefined) {
        query.table_id = filters.table_id;
      }

      const pedidos = await this.pedidoModel.find(query).exec();
      return pedidos;
    } catch (error) {
      console.error('Error fetching filtered pedidos:', error);
      return null;
    }
  }

  async createPedido(
    id: number,
    userId: number | null,
    productIds: number[],
    status: string = 'pending',
    table_id: number
  ): Promise<Pedido | null> {
    try {
      const newPedido = new this.pedidoModel({ id, userId, productIds, status, table_id });
      const savedPedido = await newPedido.save();
      return savedPedido;
    } catch (error) {
      console.error('Error creating pedido:', error);
      return null;
    }
  }

  async getById(id: number): Promise<Pedido | null> {
    try {
      const pedido = await this.pedidoModel.findOne({ id }).exec();
      return pedido;
    } catch (error) {
      console.error('Error fetching pedido by ID:', error);
      return null;
    }
  }

  async update(id: number, data: Partial<Pedido>): Promise<Pedido | null> {
    try {
      const updatedPedido = await this.pedidoModel.findOneAndUpdate({ id }, data, { new: true }).exec();
      return updatedPedido;
    } catch (error) {
      console.error('Error updating pedido:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.pedidoModel.deleteOne({ id }).exec();
      return true;
    } catch (error) {
      console.error('Error deleting pedido:', error);
      return false;
    }
  }

  async getActiveByTableId(table_id: number): Promise<Pedido | null> {
    try {
      // Considera activo si el status es 'pendiente' o 'servido'
      const pedido = await this.pedidoModel.findOne({ table_id, status: { $in: ['pendiente', 'servido'] } }).exec();
      return pedido;
    } catch (error) {
      console.error('Error fetching active pedido by table_id:', error);
      return null;
    }
  }
}
