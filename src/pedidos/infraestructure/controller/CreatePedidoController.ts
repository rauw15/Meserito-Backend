import { Request, Response } from 'express';
import { CreatePedidoUseCase } from '../../application/CreatePedidoUseCase';
import { globalWebSocketServer } from '../../../server';

export class CreatePedidoController {
  constructor(private readonly createPedidoUseCase: CreatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    // ✅ CAMBIO: Extraer todos los datos del body
    const { table_id, userId, productIds } = req.body;

    // Validación básica de entrada
    if (!table_id || !userId || !Array.isArray(productIds)) {
      res.status(400).send({ status: 'error', message: 'Missing required fields: table_id, userId, productIds' });
      return;
    }

    try {
      // ✅ CAMBIO: Pasar todos los datos al UseCase
      const newPedido = await this.createPedidoUseCase.run(table_id, userId, productIds);

      if (newPedido) {
        // Lógica de WebSocket (sin cambios)
        if (globalWebSocketServer) {
          globalWebSocketServer.notifyOrderUpdate(
            newPedido.id.toString(),
            'creado',
            table_id.toString(),
            `Nuevo pedido #${newPedido.id} creado para la mesa ${table_id}`
          );
          globalWebSocketServer.sendNotification(
            `📋 Nuevo pedido creado: #${newPedido.id} en mesa ${table_id}`
          );
        }
        
        res.status(201).send({ status: 'success', data: newPedido });
      } else {
        // Este caso ahora es menos probable si el UseCase lanza errores
        res.status(500).send({ status: 'error', message: 'Error creating pedido' });
      }
    } catch (error: unknown) {
      // Lógica de manejo de errores (sin cambios)
      if (error instanceof Error) {
        if (error.message === 'TABLE_NOT_FOUND') {
          res.status(404).send({ status: 'error', message: 'Table not found' });
        } else if (error.message === 'TABLE_NOT_AVAILABLE') {
          res.status(400).send({ status: 'error', message: 'Table is not available' });
        } else if (error.message === 'TABLE_HAS_ACTIVE_ORDER') {
          res.status(409).send({ status: 'error', message: 'Table already has an active order' });
        } else {
          res.status(500).send({ status: 'error', message: error.message });
        }
      } else {
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
      }
    }
  }
}