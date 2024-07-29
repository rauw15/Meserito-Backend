import { Request, Response } from 'express';
import { GetAllPedidosUseCase } from '../../application/GetAllPedidosUseCase';

export class GetAllPedidosController {
  constructor(private readonly getAllPedidosUseCase: GetAllPedidosUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    try {
      const pedidos = await this.getAllPedidosUseCase.run();
      if (pedidos) {
        res.status(200).send({ status: 'success', data: pedidos });
      } else {
        res.status(404).send({ status: 'error', message: 'No pedidos found' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
