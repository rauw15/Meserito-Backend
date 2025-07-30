import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";

export class CreateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(
    id: number,
    name: string,
    description: string,
    price: number,
    imageUrl?: string
  ): Promise<Product | null> {
    try {
      const product = await this.productRepository.createProduct(
        id,
        name,
        description,
        price,
        imageUrl
      );
      return product;
    } catch (error: any) {
      // Propagar errores específicos del repository
      if (error.message === 'DUPLICATE_ID' || 
          error.message === 'DUPLICATE_NAME' || 
          error.message === 'DUPLICATE_FIELD') {
        throw error;
      }
      
      console.error('Error creating product:', error);
      throw new Error('Error al crear el producto');
    }
  }
}
