import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';

export class UpdatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(id: number, data: Partial<Pedido>): Promise<Pedido | null> {
    try {
      const updatedPedido = await this.pedidoRepository.update(id, data);
      return updatedPedido;
    } catch (error) {
      console.error('Error updating pedido:', error);
      return null;
    }
  }
}
