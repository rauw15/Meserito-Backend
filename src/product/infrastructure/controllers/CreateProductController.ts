import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const file = req.file; // 'req.file' es poblado por multer

    // La validación de datos se mantiene igual...
    if (!data.name || !data.description || data.price === undefined) {
      return res.status(400).send({
        status: "error",
        msn: "Todos los campos son obligatorios: name, description, price",
      });
    }

    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send({
        status: "error",
        msn: "El precio debe ser un número positivo",
      });
    }

    // ✅ OBTENER LA URL DE CLOUDINARY
    // 'req.file.path' ahora contiene la URL https://... de Cloudinary
    const imageUrl = file ? file.path : data.imageUrl; // Permite enviar una URL existente también

    try {
      // El backend no debe generar el ID, se debe generar automáticamente
      const product = await this.createProductUseCase.run(
        data.name.trim(),
        data.description.trim(),
        price,
        data.category || 'comida', // Añadir categoría
        imageUrl // Pasamos la URL de Cloudinary
      );

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
      
      res.status(500).send({
        status: "error",
        data: "Ocurrió un error al crear el producto",
        msn: error.message || "Error interno del servidor",
      });
    }
  }
}