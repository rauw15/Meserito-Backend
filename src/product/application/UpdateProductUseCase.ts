import { Product } from "../domain/Product";
import { ProductRepository } from "../domain/ProductRepository"; 


export class UpdateProductUseCase {
  constructor(private readonly productRepository: ProductRepository) {}

  async run(id: number, data: Partial<Product>): Promise<Product | null> {
    try {
      const updatedProduct = await this.productRepository.update(id, data);
      return updatedProduct;
    } catch (error: any) {
      // Propagar errores específicos del repository
      if (error.message === 'DUPLICATE_NAME' || 
          error.message === 'DUPLICATE_FIELD') {
        throw error;
      }
      
      console.error('Error updating product:', error);
      throw new Error('Error al actualizar el producto');
    }
  }
}
