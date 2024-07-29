import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';
import ProductModel from '../../product/domain/Product';

export class CreatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(productIds: number[]): Promise<Pedido | null> {
    try {
      // Verificar si los productos existen
      const productsExist = await ProductModel.find({ id: { $in: productIds } }).countDocuments() === productIds.length;
      if (!productsExist) {
        throw new Error('One or more products not found');
      }

      // Crear el pedido con un estado predeterminado
      const newPedidoId = Date.now();
      const status = 'pending'; // Puedes ajustar esto según tus necesidades

      const newPedido = await this.pedidoRepository.createPedido(newPedidoId, null, productIds, status); // userId es null
      return newPedido;
    } catch (error) {
      console.error('Error creating pedido:', error);
      return null;
    }
  }
}
