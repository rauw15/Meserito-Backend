import { Request, Response } from 'express';
import { GetAllPedidosUseCase } from '../../application/GetAllPedidosUseCase';
import { PedidoFilters } from '../../domain/PedidoRepository';

export class GetAllPedidosController {
  constructor(private readonly getAllPedidosUseCase: GetAllPedidosUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      // Extraer y parsear los filtros de los query parameters de forma segura
      const filters: PedidoFilters = {};
      
      if (req.query.status) {
        filters.status = req.query.status as string;
      }
      
      if (req.query.user_id) { // <-- Corregido para buscar por 'user_id'
        const userId = parseInt(req.query.user_id as string, 10);
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
      
      console.log(`🔍 GetAllPedidosController - Pedidos obtenidos: ${pedidos?.length || 0}`);
      
      if (pedidos) {
        // Formatear los pedidos para que coincidan con la estructura que el frontend espera.
        // El frontend espera 'id' y 'name' para los productos, y 'customerEmail', etc.
        const formattedPedidos = pedidos.map(pedido => {
          
          // Mapear los productos del pedido a la estructura simple que el frontend necesita ahora mismo
          const frontendProducts = pedido.products.map(p => ({
            id: p.product_id,
            name: p.name,
            price: p.price,
            quantity: p.quantity
          }));
          
          // ✅ Estructura final que se envía al frontend
          return {
            // Datos del pedido principal
            id: pedido.id,
            table_id: pedido.table_id,
            status: pedido.status,
            total: pedido.total,
            
            // Datos del usuario/mesero
            userId: pedido.user_id, // El frontend espera 'userId' (camelCase)
            waiter: pedido.user_info?.name || `Mesero #${pedido.user_id}`,
            
            // Productos y timestamps
            products: frontendProducts, // Los productos ya formateados
            createdAt: pedido.created_at, // Enviar la fecha en formato ISO que es más estándar
            
            // Datos extra que el frontend puede usar (como customerEmail)
            customerEmail: `Mesa ${pedido.table_id}`,
            customerName: pedido.user_info?.name || `Mesa ${pedido.table_id}`,
          };
        });

        // Log de depuración para el primer pedido formateado
        if (formattedPedidos.length > 0) {
          console.log('📋 Primer pedido formateado para el frontend:', formattedPedidos[0]);
        }

        res.status(200).send({ 
          status: 'success', 
          data: formattedPedidos,
          filters: Object.keys(filters).length > 0 ? filters : null
        });
      } else {
        res.status(404).send({ status: 'error', message: 'No se encontraron pedidos' });
      }
    } catch (error) {
      console.error('Error in GetAllPedidosController:', error);
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}