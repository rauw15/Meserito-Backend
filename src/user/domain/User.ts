import mongoose, { Schema, Document, Model } from 'mongoose';

export interface User extends Document {
  role: any;
  id: number;
  name: string;
  password: string;
  email: string;
}

const UserSchema: Schema = new Schema({
  id: { type: Number, required: true, index: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, required: true, enum: ['user', 'admin'], default: 'user' }  
});

const UserModel: Model<User> = mongoose.model<User>('User', UserSchema);
export default UserModel;
