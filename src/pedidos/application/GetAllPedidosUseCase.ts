import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';

export class GetAllPedidosUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(): Promise<Pedido[] | null> {
    try {
      const pedidos = await this.pedidoRepository.getAll();
      return pedidos;
    } catch (error) {
      console.error('Error fetching all pedidos:', error);
      return null;
    }
  }
}
