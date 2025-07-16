import { Request, Response } from 'express';
import { CreatePedidoUseCase } from '../../application/CreatePedidoUseCase';

export class CreatePedidoController {
  constructor(private readonly createPedidoUseCase: CreatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const { table_id } = req.body;

    try {
      const newPedido = await this.createPedidoUseCase.run(table_id);
      if (newPedido) {
        res.status(201).send({ status: 'success', data: newPedido });
      } else {
        res.status(400).send({ status: 'error', message: 'Error creating pedido or invalid data' });
      }
    } catch (error: unknown) {
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
