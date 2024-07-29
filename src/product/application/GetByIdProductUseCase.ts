import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository";

export class GetByIdProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(id: number): Promise<Product | null> {
    try {
      const product = await this.productRepository.getById(id);
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }
}
