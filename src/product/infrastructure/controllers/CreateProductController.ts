import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const file = req.file;

    // ✅✅✅ ESTA ES LA VALIDACIÓN CORRECTA ✅✅✅
    // No se valida 'id'. Se valida 'category' que sí es obligatorio.
    if (!data.name || !data.description || !data.price || !data.category) {
      return res.status(400).send({
        status: "error",
        msn: "Campos obligatorios faltantes: name, description, price, category",
      });
    }

    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send({
        status: "error",
        msn: "El precio debe ser un número positivo",
      });
    }

    const imageUrl = file ? file.path : undefined;

    try {
      const product = await this.createProductUseCase.run(
        data.name.trim(),
        data.description.trim(),
        price,
        data.category,
        imageUrl
      );

      if (!product) {
        return res.status(500).send({
          status: "error",
          msn: "El producto no pudo ser creado.",
        });
      }

      res.status(201).send({
        status: "success",
        data: product,
        msn: "Producto creado con éxito",
      });
    } catch (error: any) {
      if (error.message === 'DUPLICATE_NAME') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con este nombre",
        });
      }
      
      console.error("Error en CreateProductController:", error);
      res.status(500).send({
        status: "error",
        msn: error.message || "Error interno del servidor",
      });
    }
  }
}