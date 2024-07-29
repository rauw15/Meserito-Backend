import { Request, Response } from "express";
import { GetByIdProductUseCase } from "../../application/GetByIdProductUseCase";

export class GetByIdProductController {
  constructor(private getByIdProductUseCase: GetByIdProductUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      const product = await this.getByIdProductUseCase.run(id);

      if (product) {
        res.status(200).send({
          status: "success",
          data: {
            id: product.id,
            name: product.name,
            description: product.description,
            price: product.price,
          },
        });
      } else {
        res.status(404).send({
          status: "error",
          msn: "Producto no encontrado",
        });
      }
    } catch (error) {
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al obtener el producto",
        msn: error,
      });
    }
  }
}
