import { Request, Response } from "express";
import { DeleteProductUseCase } from "../../application/DeleteProductUseCase";

export class DeleteProductController {
  constructor(private deleteProductUseCase: DeleteProductUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);

    try {
      await this.deleteProductUseCase.run(id);
      res.status(200).send({
        status: "success",
        msn: "Producto eliminado con éxito",
      });
    } catch (error) {
      if (error instanceof Error) { // Comprobando si error es una instancia de Error
        if (error.message === "Producto no encontrado") {
          res.status(404).send({
            status: "error",
            msn: "Producto no encontrado",
          });
        } else {
          res.status(500).send({
            status: "error",
            data: "Ocurrió un error al eliminar el producto",
            msn: error.message,
          });
        }
      } else {
        res.status(500).send({
          status: "error",
          data: "Ocurrió un error al eliminar el producto",
        });
      }
    }
  }
}
