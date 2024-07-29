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
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
    }
  }
}
