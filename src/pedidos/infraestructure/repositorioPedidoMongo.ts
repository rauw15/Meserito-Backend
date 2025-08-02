import { Model } from 'mongoose';
import { Pedido } from '../domain/Pedido';
import PedidoModel from '../domain/Pedido'; // Modelo de Mongoose para Pedido
import { PedidoRepository, PedidoFilters, CreatePedidoData } from '../domain/PedidoRepository';

export class PedidoMongoRepository implements PedidoRepository {
  private pedidoModel: Model<Pedido>;

  constructor() {
    this.pedidoModel = PedidoModel;
  }

  async getAll(): Promise<Pedido[] | null> {
    try {
      const pedidos = await this.pedidoModel.find().sort({ created_at: -1 }).exec();
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
        query.user_id = filters.userId;
      }
      
      if (filters.table_id !== undefined) {
        query.table_id = filters.table_id;
      }

      const pedidos = await this.pedidoModel.find(query).sort({ created_at: -1 }).exec();
      return pedidos;
    } catch (error) {
      console.error('Error fetching filtered pedidos:', error);
      return null;
    }
  }

  async createPedido(data: CreatePedidoData): Promise<Pedido | null> {
    try {
      // Generar ID único
      const lastPedido = await this.pedidoModel.findOne().sort({ id: -1 }).exec();
      const newId = lastPedido ? lastPedido.id + 1 : 1;

      const newPedido = new this.pedidoModel({
        id: newId,
        table_id: data.table_id,
        user_id: data.user_id,
        user_info: data.user_info,
        products: data.products,
        total: data.total,
        status: data.status || 'pendiente',
        timestamp: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      });

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
      const updatedPedido = await this.pedidoModel.findOneAndUpdate(
        { id }, 
        { ...data, updated_at: new Date() }, 
        { new: true }
      ).exec();
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
      // Considera activo si el status es 'pendiente' o 'en-preparacion'
      const pedido = await this.pedidoModel.findOne({ 
        table_id, 
        status: { $in: ['pendiente', 'en-preparacion'] } 
      }).exec();
      return pedido;
    } catch (error) {
      console.error('Error fetching active pedido by table_id:', error);
      return null;
    }
  }
}
