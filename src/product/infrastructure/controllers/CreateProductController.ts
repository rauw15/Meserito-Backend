import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const file = req.file; // Obtener el archivo de la solicitud

    // Validación básica
    if (!data.id || !data.name || !data.description || !data.price) {
      return res.status(400).send({
        status: "error",
        msn: "Todos los campos son obligatorios: id, name, description, price",
      });
    }

    const imageUrl = file ? file.path : undefined; // Obtener la URL de la imagen si se cargó una

    try {
      const product = await this.createProductUseCase.run(
        data.id,
        data.name,
        data.description,
        data.price,
        imageUrl
      );

      res.status(201).send({
        status: "success",
        data: product,
        msn: "Producto creado con éxito",
      });
    } catch (error: unknown) {
      const err = error as any; // Asignar el tipo `any` al error
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al crear el producto",
        msn: err.message,
      });
    }
  }
}
