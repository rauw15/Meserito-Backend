import { Product } from "../domain/Product";

export interface ProductRepository {
  getAll(): Promise<Product[] | null>;
  createProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    imageUrl?: string // Agregar la propiedad imageUrl al método createProduct
  ): Promise<Product | null>;
  getById(id: number): Promise<Product | null>;
  update(id: number, data: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
}
