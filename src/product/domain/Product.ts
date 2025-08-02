import mongoose, { Schema, Document } from 'mongoose';

export interface Product extends Document {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl?: string; // Agregar la propiedad imageUrl
}

const ProductSchema: Schema = new Schema({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, required: true, default: 'comida' },
  imageUrl: { type: String }, // Agregar la propiedad imageUrl al esquema
});

export default mongoose.model<Product>('Product', ProductSchema);
