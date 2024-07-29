import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository"; // Cambiar la importación a ProductRepository


export class GetAllProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(): Promise<Product[] | null> {
    try {
      const products = await this.productRepository.getAll();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return null;
    }
  }
}
