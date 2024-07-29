import { Request, Response } from 'express';
import { DeletePedidoUseCase } from '../../application/DeletePedidoUseCase';

export class DeletePedidoController {
  constructor(private readonly deletePedidoUseCase: DeletePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);

    try {
      const success = await this.deletePedidoUseCase.run(id);
      if (success) {
        res.status(200).send({ status: 'success', message: 'Pedido deleted' });
      } else {
        res.status(400).send({ status: 'error', message: 'Error deleting pedido' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
