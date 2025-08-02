import { Request, Response } from 'express';
import { GetAllPedidosUseCase } from '../../application/GetAllPedidosUseCase';
import { PedidoFilters } from '../../domain/PedidoRepository';

export class GetAllPedidosController {
  constructor(private readonly getAllPedidosUseCase: GetAllPedidosUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Extraer filtros de los query parameters
      const filters: PedidoFilters = {};
      
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      
      if (req.query.userId) {
        const userId = parseInt(req.query.userId as string, 10);
        if (!isNaN(userId)) {
          filters.userId = userId;
        }
      }
      
      if (req.query.table_id) {
        const table_id = parseInt(req.query.table_id as string, 10);
        if (!isNaN(table_id)) {
          filters.table_id = table_id;
        }
      }

      const pedidos = await this.getAllPedidosUseCase.run(filters);
      
      if (pedidos) {
        // Formatear los pedidos para el frontend
        const formattedPedidos = pedidos.map(pedido => ({
          id: pedido.id,
          table_id: pedido.table_id,
          user_id: pedido.user_id,
          customerEmail: pedido.user_info?.email || 'No disponible',
          customerName: pedido.user_info?.name || 'Cliente',
          products: pedido.products.map(product => ({
            id: product.product_id,
            name: product.name,
            price: product.price,
            quantity: product.quantity,
            unit_price: product.unit_price
          })),
          total: pedido.total,
          status: pedido.status,
          timestamp: pedido.timestamp ? new Date(pedido.timestamp).toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          }) : 'No disponible',
          created_at: pedido.created_at,
          updated_at: pedido.updated_at
        }));

        res.status(200).send({ 
          status: 'success', 
          data: formattedPedidos,
          filters: Object.keys(filters).length > 0 ? filters : null
        });
      } else {
        res.status(404).send({ status: 'error', message: 'No pedidos found' });
      }
    } catch (error) {
      console.error('Error in GetAllPedidosController:', error);
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
