import { Document } from 'mongoose';

export interface Pedido extends Document {
  id: number;
  userId: number;
  productIds: number[];
  status: string;
}

import mongoose, { Schema } from 'mongoose';

const PedidoSchema: Schema = new Schema({
  id: { type: Number, required: true, index: true },
  userId: { type: Number},
  productIds: { type: [Number], required: true },
  status: { type: String, required: true },
});

export default mongoose.model<Pedido>('Pedido', PedidoSchema);
