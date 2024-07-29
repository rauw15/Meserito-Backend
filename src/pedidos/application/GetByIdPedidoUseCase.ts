import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';

export class GetByIdPedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(id: number): Promise<Pedido | null> {
    try {
      const pedido = await this.pedidoRepository.getById(id);
      return pedido;
    } catch (error) {
      console.error('Error fetching pedido by ID:', error);
      return null;
    }
  }
}
