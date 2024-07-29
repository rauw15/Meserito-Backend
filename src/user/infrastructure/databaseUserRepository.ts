import { UserRepository } from '../domain/UserRepository';
import UserModel, { User as UserInterface } from '../domain/User'; 
import { Model } from 'mongoose';

export class UserMongoRepository implements UserRepository {
  private userModel: Model<UserInterface>;

  constructor() {
    this.userModel = UserModel;
  }

  async getAll(): Promise<UserInterface[] | null> {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error);
      return null;
    }
  }

  async createUser(id: number, name: string, password: string, email: string): Promise<UserInterface | null> {
    try {
      const newUser = new this.userModel({ id, name, password, email });
      const savedUser = await newUser.save();
      return savedUser;
    } catch (error) {
      console.error('Error creating user:', error);
      return null;
    }
  }

  async getById(id: number): Promise<UserInterface | null> {
    try {
      const user = await this.userModel.findOne({ id }).exec(); // Cambiado a findOne
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  }

  async findByEmail(email: string): Promise<UserInterface | null> {
    try {
      const user = await this.userModel.findOne({ email }).exec(); // Nuevo método
      return user;
    } catch (error) {
      console.error('Error fetching user by email:', error);
      return null;
    }
  }

  async updateUser(user: UserInterface): Promise<UserInterface | null> {
    try {
      const updatedUser = await this.userModel.findOneAndUpdate(
        { id: user.id },
        user,
        { new: true }
      ).exec();
      return updatedUser;
    } catch (error) {
      console.error('Error updating user:', error);
      return null;
    }
  }

  async deleteUser(id: number): Promise<boolean> {
    try {
      const result = await this.userModel.deleteOne({ id }).exec();
      return result.deletedCount > 0; 
    } catch (error) {
      console.error('Error deleting user:', error);
      return false;
    }
  }
}
