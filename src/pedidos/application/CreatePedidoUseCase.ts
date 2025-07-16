import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';
import TableModel from '../../table/domain/Table';

export class CreatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  async run(table_id: number): Promise<Pedido | null> {
    try {
      // Verificar si la mesa existe y está disponible
      const table = await TableModel.findOne({ id: table_id });
      if (!table) throw new Error('TABLE_NOT_FOUND');
      if (table.status !== 'disponible') throw new Error('TABLE_NOT_AVAILABLE');

      // Verificar que no haya pedido activo para esa mesa
      const existingPedido = await this.pedidoRepository.getActiveByTableId(table_id);
      if (existingPedido) throw new Error('TABLE_HAS_ACTIVE_ORDER');

      // Crear el pedido vacío
      const newPedidoId = Date.now();
      const status = 'pendiente';
      const newPedido = await this.pedidoRepository.createPedido(newPedidoId, null, [], status, table_id);
      // Cambiar estado de la mesa a ocupada
      table.status = 'ocupada';
      await table.save();
      return newPedido;
    } catch (error) {
      if (error instanceof Error && (
        error.message === 'TABLE_NOT_FOUND' ||
        error.message === 'TABLE_NOT_AVAILABLE' ||
        error.message === 'TABLE_HAS_ACTIVE_ORDER')
      ) {
        throw error;
      }
      console.error('Error creating pedido:', error);
      return null;
    }
  }
}
