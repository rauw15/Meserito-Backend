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

  // ✅✅✅ MÉTODO 'createProduct' CORREGIDO ✅✅✅
  async createProduct(
    // 1. Ya no se recibe el 'id' como parámetro.
    name: string,
    description: string,
    price: number,
    category: string, // <-- Se añade el parámetro 'category' que faltaba
    imageUrl?: string
  ): Promise<ProductInterface | null> {
    try {
      // 2. Lógica para generar un nuevo ID auto-incremental.
      // Busca el producto con el ID más alto.
      const lastProduct = await this.productModel.findOne().sort({ id: -1 });
      // El nuevo ID será el último ID + 1, o 1 si la colección está vacía.
      const newId = lastProduct ? lastProduct.id + 1 : 1;

      // Verificar si ya existe un producto con el mismo nombre (más eficiente que en el controlador)
      const existingProductByName = await this.productModel.findOne({ name }).exec();
      if (existingProductByName) {
        throw new Error('DUPLICATE_NAME');
      }

      // 3. Crear la nueva instancia del producto con el ID generado.
      const newProduct = new this.productModel({
        id: newId,
        name,
        description,
        price,
        category, // <-- Se utiliza el parámetro 'category'
        imageUrl
      });

      const savedProduct = await newProduct.save();
      return savedProduct;

    } catch (error: any) {
      // Propagar errores específicos que ya hemos lanzado
      if (error.message === 'DUPLICATE_NAME') {
        throw error;
      }
      
      // Manejar errores de índice único de MongoDB de forma genérica
      if (error.code === 11000) {
        // Esto podría ocurrir si hay una condición de carrera o si el nombre se duplica
        // entre la verificación y el guardado.
        console.error('MongoDB duplicate key error:', error.keyValue);
        throw new Error('DUPLICATE_FIELD');
      }
      
      console.error('Error creating product in repository:', error);
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
      // Si se está actualizando el nombre, verificar que no entre en conflicto con otro producto
      if (data.name) {
        const existingProduct = await this.productModel.findOne({ 
          name: data.name, 
          id: { $ne: id } // Excluir el documento actual de la búsqueda
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
      
      if (error.code === 11000) {
        throw new Error('DUPLICATE_NAME');
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