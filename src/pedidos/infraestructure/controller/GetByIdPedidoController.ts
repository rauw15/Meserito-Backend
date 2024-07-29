import { Request, Response } from 'express';
import { GetByIdPedidoUseCase } from '../../application/GetByIdPedidoUseCase';

export class GetByIdPedidoController {
  constructor(private readonly getByIdPedidoUseCase: GetByIdPedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    try {
      const pedido = await this.getByIdPedidoUseCase.run(id);
      if (pedido) {
        res.status(200).send({ status: 'success', data: pedido });
      } else {
        res.status(404).send({ status: 'error', message: 'Pedido not found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
