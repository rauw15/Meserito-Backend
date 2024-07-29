import mongoose, { Schema, Document } from 'mongoose';

export interface Table extends Document {
  id: number;
  color: string;
  numberOfClients?: number;
  status: string;
  userAssignments: { userId: number; productIds: number[] }[];
}

const TableSchema: Schema = new Schema({
  id: { type: Number, required: true, index: true },
  color: { type: String, required: true },
  numberOfClients: { type: Number },
  status: { type: String, required: true },
  userAssignments: [
    {
      userId: { type: Number, required: true },
      productIds: { type: [Number], required: true },
    },
  ],
});

export default mongoose.model<Table>('Table', TableSchema);
