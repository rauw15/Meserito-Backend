import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository"; 


export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(id: number, data: Partial<Product>): Promise<Product | null> {
    try {
      const updatedProduct = await this.productRepository.update(id, data);
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }
}
