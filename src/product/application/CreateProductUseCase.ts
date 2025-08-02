import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(
    name: string,
    description: string,
    price: number,
    category: string,
    imageUrl?: string
  ): Promise<Product | null> {
    try {
      const product = await this.productRepository.createProduct(
        name,
        description,
        price,
        category,
        imageUrl
      );
      return product;
    } catch (error: any) {
      if (error.message === 'DUPLICATE_NAME') {
        throw error; // Propagar errores específicos
      }
      
      console.error('Error in CreateProductUseCase:', error);
      throw new Error('Error al crear el producto en el UseCase');
    }
  }
}