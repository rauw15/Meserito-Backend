import { ProductRepository } from '../domain/ProductRepository';
import ProductModel, { Product as ProductInterface } from '../domain/Product';
import { Model } from 'mongoose';

export class ProductMongoRepository implements ProductRepository {
  private productModel: Model<ProductInterface>;

  constructor() {
    this.productModel = ProductModel;
  }

  async getAll(): Promise<ProductInterface[] | null> {
    try {
      const products = await this.productModel.find().exec();
      return products;
    } catch (error) {
      console.error('Error fetching all products:', error);
      return null;
    }
  }

  async createProduct(
    id: number,
    name: string,
    description: string,
    price: number,
    imageUrl?: string
  ): Promise<ProductInterface | null> {
    try {
      // Verificar si ya existe un producto con el mismo ID
      const existingProductById = await this.productModel.findOne({ id }).exec();
      if (existingProductById) {
        throw new Error('DUPLICATE_ID');
      }

      // Verificar si ya existe un producto con el mismo nombre
      const existingProductByName = await this.productModel.findOne({ name }).exec();
      if (existingProductByName) {
        throw new Error('DUPLICATE_NAME');
      }

      const newProduct = new this.productModel({ id, name, description, price, imageUrl });
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error: any) {
      if (error.message === 'DUPLICATE_ID' || error.message === 'DUPLICATE_NAME') {
        throw error;
      }
      
      // Manejar errores de MongoDB duplicados
      if (error.code === 11000) {
        if (error.keyPattern?.id) {
          throw new Error('DUPLICATE_ID');
        }
        if (error.keyPattern?.name) {
          throw new Error('DUPLICATE_NAME');
        }
        throw new Error('DUPLICATE_FIELD');
      }
      
      console.error('Error creating product:', error);
      throw new Error('DATABASE_ERROR');
    }
  }

  async getById(id: number): Promise<ProductInterface | null> {
    try {
      const product = await this.productModel.findOne({ id }).exec();
      return product;
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      return null;
    }
  }

  async update(id: number, data: Partial<ProductInterface>): Promise<ProductInterface | null> {
    try {
      // Si se está actualizando el nombre, verificar duplicados
      if (data.name) {
        const existingProduct = await this.productModel.findOne({ 
          name: data.name, 
          id: { $ne: id } // Excluir el producto actual
        }).exec();
        
        if (existingProduct) {
          throw new Error('DUPLICATE_NAME');
        }
      }

      const updatedProduct = await this.productModel.findOneAndUpdate({ id }, data, { new: true }).exec();
      return updatedProduct;
    } catch (error: any) {
      if (error.message === 'DUPLICATE_NAME') {
        throw error;
      }
      
      // Manejar errores de MongoDB duplicados
      if (error.code === 11000) {
        if (error.keyPattern?.name) {
          throw new Error('DUPLICATE_NAME');
        }
        throw new Error('DUPLICATE_FIELD');
      }
      
      console.error('Error updating product:', error);
      throw new Error('DATABASE_ERROR');
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      const result = await this.productModel.deleteOne({ id }).exec();
      return result.deletedCount > 0;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }

  // Método auxiliar para verificar si existe un producto por nombre
  async findByName(name: string): Promise<ProductInterface | null> {
    try {
      const product = await this.productModel.findOne({ name }).exec();
      return product;
    } catch (error) {
      console.error('Error finding product by name:', error);
      return null;
    }
  }
}
