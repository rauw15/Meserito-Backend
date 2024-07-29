import { Request, Response } from "express";
import { UpdateProductUseCase } from "../../application/UpdateProductUseCase";

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const data = req.body;

    try {
      const updatedProduct = await this.updateProductUseCase.run(id, data);

      if (updatedProduct) {
        res.status(200).send({
          status: "success",
          data: updatedProduct,
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
        data: "Ocurrió un error al actualizar el producto",
        msn: error,
      });
    }
  }
}
