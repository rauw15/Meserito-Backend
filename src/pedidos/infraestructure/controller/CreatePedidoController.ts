import { Request, Response } from 'express';
import { CreatePedidoUseCase } from '../../application/CreatePedidoUseCase';

export class CreatePedidoController {
  constructor(private readonly createPedidoUseCase: CreatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const { productIds } = req.body;

    try {
      const newPedido = await this.createPedidoUseCase.run(productIds);
      if (newPedido) {
        res.status(201).send({ status: 'success', data: newPedido });
      } else {
        res.status(400).send({ status: 'error', message: 'Error creating pedido or invalid data' });
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).send({ status: 'error', message: error.message });
      } else {
        res.status(500).send({ status: 'error', message: 'Internal Server Error' });
      }
    }
  }
}
