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
        res.status(200).send({ 
          status: 'success', 
          data: pedidos,
          filters: Object.keys(filters).length > 0 ? filters : null
        });
      } else {
        res.status(404).send({ status: 'error', message: 'No pedidos found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
