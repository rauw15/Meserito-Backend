import { Request, Response } from 'express';
import { UpdatePedidoUseCase } from '../../application/UpdatePedidoUseCase';

export class UpdatePedidoController {
  constructor(private readonly updatePedidoUseCase: UpdatePedidoUseCase) {}

  async run(req: Request, res: Response): Promise<void> {
    const id: number = parseInt(req.params.id, 10);
    const data = req.body;

    try {
      const updatedPedido = await this.updatePedidoUseCase.run(id, data);
      if (updatedPedido) {
        res.status(200).send({ status: 'success', data: updatedPedido });
      } else {
        res.status(400).send({ status: 'error', message: 'Error updating pedido' });
      }
    } catch (error) {
      res.status(500).send({ status: 'error', message: 'Internal Server Error' });
    }
  }
}
