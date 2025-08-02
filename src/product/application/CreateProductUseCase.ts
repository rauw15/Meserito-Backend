import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(
    name: string,
    description: string,
    price: number,
    category: string, // <-- Añadir categoría
    imageUrl?: string
  ): Promise<Product | null> {
    try {
      // El ID debe ser generado por la capa de repositorio o la base de datos
      const product = await this.productRepository.createProduct(
        name,
        description,
        price,
        category, // <-- Pasar categoría
        imageUrl
      );
      return product;
    } catch (error: any) {
      if (error.message === 'DUPLICATE_NAME') {
        throw error;
      }
      
      console.error('Error in CreateProductUseCase:', error);
      throw new Error('Error al crear el producto');
    }
  }
}