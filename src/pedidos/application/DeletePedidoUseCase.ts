import { PedidoRepository } from '../domain/PedidoRepository';

export class DeletePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(id: number): Promise<boolean> {
    try {
      const result = await this.pedidoRepository.delete(id);
      return result;
    } catch (error) {
      console.error('Error deleting pedido:', error);
      return false;
    }
  }
}
