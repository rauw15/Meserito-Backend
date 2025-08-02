import { Product } from './Product';

// Esta interfaz define el "contrato" que cualquier repositorio de productos debe seguir.
export interface ProductRepository {
  getAll(): Promise<Product[] | null>;
  getById(id: number): Promise<Product | null>;
  update(id: number, data: Partial<Product>): Promise<Product | null>;
  delete(id: number): Promise<boolean>;
  findByName(name: string): Promise<Product | null>;


  createProduct(
    name: string,
    description: string,
    price: number,
    category: string, // <-- Parámetro añadido
    imageUrl?: string
  ): Promise<Product | null>;
}