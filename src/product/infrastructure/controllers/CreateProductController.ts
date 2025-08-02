import { Request, Response } from "express";
import { CreateProductUseCase } from "../../application/CreateProductUseCase";

export class CreateProductController {
  constructor(private createProductUseCase: CreateProductUseCase) {}

  async run(req: Request, res: Response) {
    const data = req.body;
    const file = req.file; // 'req.file' es poblado por multer

    // ✅✅✅ VALIDACIÓN CORREGIDA ✅✅✅
    // Ya no se exige el 'id'. Solo los campos que el usuario debe proporcionar.
    if (!data.name || !data.description || !data.price || !data.category) {
      return res.status(400).send({
        status: "error",
        msn: "Campos obligatorios faltantes: name, description, price, category",
      });
    }

    // Validación de tipos (se mantiene)
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      return res.status(400).send({
        status: "error",
        msn: "El precio debe ser un número positivo",
      });
    }

    // Obtener la URL de Cloudinary si existe
    const imageUrl = file ? file.path : undefined;

    try {
      // ✅ La llamada al UseCase ya no incluye el ID
      const product = await this.createProductUseCase.run(
        data.name.trim(),
        data.description.trim(),
        price,
        data.category,
        imageUrl
      );

      // Si el producto no se pudo crear (por alguna razón que no sea un error)
      if (!product) {
        return res.status(500).send({
          status: "error",
          msn: "El producto no pudo ser creado en el repositorio.",
        });
      }

      res.status(201).send({
        status: "success",
        data: product,
        msn: "Producto creado con éxito",
      });
    } catch (error: any) {
      // Manejar errores específicos lanzados desde el UseCase/Repository
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