import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const file = req.file; // Obtener el archivo de la solicitud

    // Validación básica de campos requeridos
    if (!data.id || !data.name || !data.description || data.price === undefined) {
      return res.status(400).send({
        status: "error",
        msn: "Todos los campos son obligatorios: id, name, description, price",
      });
    }

    // Validaciones específicas para datos inválidos
    if (typeof data.id !== 'number' && isNaN(Number(data.id))) {
      return res.status(400).send({
        status: "error",
        msn: "El ID debe ser un número válido",
      });
    }

    if (typeof data.name !== 'string' || data.name.trim().length < 2) {
      return res.status(400).send({
        status: "error",
        msn: "El nombre debe ser una cadena de al menos 2 caracteres",
      });
    }

    if (typeof data.description !== 'string' || data.description.trim().length < 5) {
      return res.status(400).send({
        status: "error",
        msn: "La descripción debe ser una cadena de al menos 5 caracteres",
      });
    }

    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send({
        status: "error",
        msn: "El precio debe ser un número positivo",
      });
    }

    const productId = Number(data.id);
    const imageUrl = file ? file.path : undefined; // Obtener la URL de la imagen si se cargó una

    try {
      const product = await this.createProductUseCase.run(
        productId,
        data.name.trim(),
        data.description.trim(),
        price,
        imageUrl
      );

      res.status(201).send({
        status: "success",
        data: product,
        msn: "Producto creado con éxito",
      });
    } catch (error: unknown) {
      const err = error as any; // Asignar el tipo `any` al error
      
      // Manejar errores específicos
      if (err.message === 'DUPLICATE_ID') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con este ID",
        });
      }
      
      if (err.message === 'DUPLICATE_NAME') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con este nombre",
        });
      }
      
      if (err.message === 'DUPLICATE_FIELD') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con estos datos",
        });
      }

      // Error genérico
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al crear el producto",
        msn: err.message || "Error interno del servidor",
      });
    }
  }
}
