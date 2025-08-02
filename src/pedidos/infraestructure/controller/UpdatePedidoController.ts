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
        // Formatear la respuesta para el frontend
        const formattedPedido = {
          id: updatedPedido.id,
          table_id: updatedPedido.table_id,
          user_id: updatedPedido.user_id,
          customerEmail: updatedPedido.user_info?.email || 'No disponible',
          customerName: updatedPedido.user_info?.name || 'Cliente',
          products: updatedPedido.products.map(product => ({
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            unit_price: product.unit_price
          })),
          total: updatedPedido.total,
          status: updatedPedido.status,
          timestamp: updatedPedido.timestamp ? new Date(updatedPedido.timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : 'No disponible',
          created_at: updatedPedido.created_at,
          updated_at: updatedPedido.updated_at
        };

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
        
        res.status(200).send({ status: 'success', data: formattedPedido });
      } else {
        res.status(400).send({ status: 'error', message: 'Error updating pedido' });
      }
    } catch (error) {
      console.error('Error in UpdatePedidoController:', error);
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }

  private getStatusMessage(status: string): string {
    const statusMessages: { [key: string]: string } = {
      'pendiente': 'está pendiente',
      'en-preparacion': 'está en preparación',
      'entregado': 'ha sido entregado',
      'cancelado': 'ha sido cancelado'
    };
    
    return statusMessages[status] || 'ha sido actualizado';
  }
}
