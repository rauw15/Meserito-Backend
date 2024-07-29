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
      const newProduct = new this.productModel({ id, name, description, price, imageUrl });
      const savedProduct = await newProduct.save();
      return savedProduct;
    } catch (error) {
      console.error('Error creating product:', error);
      return null;
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
      const updatedProduct = await this.productModel.findOneAndUpdate({ id }, data, { new: true }).exec();
      return updatedProduct;
    } catch (error) {
      console.error('Error updating product:', error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.productModel.deleteOne({ id }).exec();
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}
