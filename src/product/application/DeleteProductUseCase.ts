import { ProductRepository } from "../domain/ProductRepository";

export class DeleteProductUseCase {
  private readonly productRepository: ProductRepository;

  constructor(productRepository: ProductRepository) {
    this.productRepository = productRepository;
  }

  async run(productId: number): Promise<void> {
    const product = await this.productRepository.getById(productId);

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    await this.productRepository.delete(productId);
  }
}
