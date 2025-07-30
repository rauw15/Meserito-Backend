import { Request, Response } from "express";
import { UpdateProductUseCase } from "../../application/UpdateProductUseCase";

export class UpdateProductController {
  constructor(private updateProductUseCase: UpdateProductUseCase) {}

  async run(req: Request, res: Response) {
    const id: number = parseInt(req.params.id);
    const data = req.body;

    // Validar que el ID sea válido
    if (isNaN(id)) {
      return res.status(400).send({
        status: "error",
        msn: "ID de producto inválido",
      });
    }

    // Validaciones específicas para los datos de actualización
    if (data.name !== undefined) {
      if (typeof data.name !== 'string' || data.name.trim().length < 2) {
        return res.status(400).send({
          status: "error",
          msn: "El nombre debe ser una cadena de al menos 2 caracteres",
        });
      }
      data.name = data.name.trim();
    }

    if (data.description !== undefined) {
      if (typeof data.description !== 'string' || data.description.trim().length < 5) {
        return res.status(400).send({
          status: "error",
          msn: "La descripción debe ser una cadena de al menos 5 caracteres",
        });
      }
      data.description = data.description.trim();
    }

    if (data.price !== undefined) {
      const price = Number(data.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).send({
          status: "error",
          msn: "El precio debe ser un número positivo",
        });
      }
      data.price = price;
    }

    try {
      const updatedProduct = await this.updateProductUseCase.run(id, data);

      if (updatedProduct) {
        res.status(200).send({
          status: "success",
          data: updatedProduct,
          msn: "Producto actualizado con éxito",
        });
      } else {
        res.status(404).send({
          status: "error",
          msn: "Producto no encontrado",
        });
      }
    } catch (error: any) {
      // Manejar errores específicos
      if (error.message === 'DUPLICATE_NAME') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con este nombre",
        });
      }
      
      if (error.message === 'DUPLICATE_FIELD') {
        return res.status(409).send({
          status: "error",
          msn: "Ya existe un producto con estos datos",
        });
      }

      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al actualizar el producto",
        msn: error.message || "Error interno del servidor",
      });
    }
  }
}
