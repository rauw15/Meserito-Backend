import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string; // Agregar la propiedad imageUrl
}

const ProductSchema: Schema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  imageUrl: { type: String }, // Agregar la propiedad imageUrl al esquema
});

export default mongoose.model<Product>('Product', ProductSchema);
