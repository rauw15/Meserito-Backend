import { Document } from 'mongoose';

// Interfaz para productos en el pedido
export interface ProductoEnPedido {
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  unit_price: number;
}

// Interfaz para información del usuario
export interface UsuarioInfo {
  id: number;
  name: string;
  email: string;
}

export interface Pedido extends Document {
  id: number;
  table_id: number;
  user_id: number;
  user_info?: UsuarioInfo;
  products: ProductoEnPedido[];
  total: number;
  status: string;
  timestamp: Date;
  created_at: Date;
  updated_at: Date;
}

import mongoose, { Schema } from 'mongoose';

// Schema para productos en el pedido
const ProductoEnPedidoSchema = new Schema({
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit_price: { type: Number, required: true }
}, { _id: false });

// Schema para información del usuario
const UsuarioInfoSchema = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true }
}, { _id: false });

const PedidoSchema: Schema = new Schema({
  id: { type: Number, required: true, index: true },
  table_id: { type: Number, required: true },
  user_id: { type: Number, required: true },
  user_info: { type: UsuarioInfoSchema },
  products: { type: [ProductoEnPedidoSchema], required: true },
  total: { type: Number, required: true },
  status: { 
    type: String, 
    required: true, 
    enum: ['pendiente', 'en-preparacion', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  timestamp: { type: Date, default: Date.now },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

// Middleware para actualizar updated_at
PedidoSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

export default mongoose.model<Pedido>('Pedido', PedidoSchema);
