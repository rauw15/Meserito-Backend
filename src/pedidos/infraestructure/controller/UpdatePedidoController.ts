import { Request, Response } from 'express';
import { UpdatePedidoUseCase } from '../../application/UpdatePedidoUseCase';
import { globalWebSocketServer } from '../../../server';

export class UpdatePedidoController {
  constructor(private readonly updatePedidoUseCase: UpdatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    const data = req.body;

    try {
      const updatedPedido = await this.updatePedidoUseCase.run(id, data);
      if (updatedPedido) {
        // Enviar notificación WebSocket sobre la actualización del pedido
        if (globalWebSocketServer) {
          const statusMessage = this.getStatusMessage(data.status);
          
          globalWebSocketServer.notifyOrderUpdate(
            updatedPedido.id.toString(),
            data.status || 'actualizado',
            updatedPedido.table_id.toString(),
            `Pedido #${updatedPedido.id} ${statusMessage}`
          );
          
          // Notificación específica basada en el estado
          if (data.status) {
            globalWebSocketServer.sendNotification(
              `🔄 Pedido #${updatedPedido.id} ${statusMessage}`,
              updatedPedido.table_id.toString()
            );
          }
        }
        
        res.status(200).send({ status: 'success', data: updatedPedido });
      } else {
        res.status(400).send({ status: 'error', message: 'Error updating pedido' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }

  private getStatusMessage(status: string): string {
    const statusMessages: { [key: string]: string } = {
      'pendiente': 'está pendiente',
      'en_preparacion': 'está en preparación',
      'preparado': 'está listo',
      'entregado': 'ha sido entregado',
      'pagado': 'ha sido pagado',
      'cancelado': 'ha sido cancelado'
    };
    
    return statusMessages[status] || 'ha sido actualizado';
  }
}
