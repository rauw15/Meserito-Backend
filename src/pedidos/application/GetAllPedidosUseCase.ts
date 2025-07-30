import { PedidoRepository, PedidoFilters } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';

export class GetAllPedidosUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(filters?: PedidoFilters): Promise<Pedido[] | null> {
    try {
      // Si hay filtros, usar getFiltered, sino usar getAll
      const pedidos = filters && Object.keys(filters).length > 0 
        ? await this.pedidoRepository.getFiltered(filters)
        : await this.pedidoRepository.getAll();
      
      return pedidos;
    } catch (error) {
      console.error('Error fetching pedidos:', error);
      return null;
    }
  }
}
