import { PedidoRepository } from '../domain/PedidoRepository';
import { Pedido } from '../domain/Pedido';
import TableModel from '../../table/domain/Table';

export class CreatePedidoUseCase {
  constructor(private readonly pedidoRepository: PedidoRepository) {}

  // ✅ CAMBIO: Ahora acepta todos los datos necesarios del pedido
  async run(
    table_id: number,
    userId: number,
    productIds: number[]
  ): Promise<Pedido | null> {
    try {
      // 1. Verificar si la mesa existe y está disponible
      const table = await TableModel.findOne({ id: table_id });
      if (!table) {
        throw new Error('TABLE_NOT_FOUND');
      }
      if (table.status !== 'disponible') {
        throw new Error('TABLE_NOT_AVAILABLE');
      }

      // 2. Verificar que no haya pedido activo para esa mesa (opcional pero recomendado)
      const existingPedido = await this.pedidoRepository.getActiveByTableId(table_id);
      if (existingPedido) {
        throw new Error('TABLE_HAS_ACTIVE_ORDER');
      }

      // 3. Crear el nuevo pedido con los datos recibidos
      const newPedidoId = Date.now(); // O genera el ID como prefieras
      const status = 'pendiente'; // Estado inicial
      
      const newPedido = await this.pedidoRepository.createPedido(
        newPedidoId,
        userId,       // <-- Usar el userId real
        productIds,   // <-- Usar los productIds reales
        status,
        table_id
      );

      // 4. Cambiar estado de la mesa a 'ocupada'
      table.status = 'ocupada';
      // Opcional: Asignar el pedido a la mesa si tu lógica lo requiere
      // table.userAssignments.push({ userId, productIds });
      await table.save();

      return newPedido;

    } catch (error) {
      // Re-lanzar errores específicos para que el controlador los maneje
      if (error instanceof Error && (
        error.message === 'TABLE_NOT_FOUND' ||
        error.message === 'TABLE_NOT_AVAILABLE' ||
        error.message === 'TABLE_HAS_ACTIVE_ORDER')
      ) {
        throw error;
      }
      console.error('Error in CreatePedidoUseCase:', error);
      // Devolver null o lanzar un error genérico para otros casos
      return null;
    }
  }
}