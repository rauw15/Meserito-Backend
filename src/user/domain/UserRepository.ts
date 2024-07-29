import { User } from "./User";

export interface UserRepository {
  getAll(): Promise<User[] | null>;
  createUser(
    id: number,
    name: string,
    password: string,
    email: string
  ): Promise<User | null>;
  getById(id: number): Promise<User | null>; 
  findByEmail(email: string): Promise<User | null>; 
  updateUser(user: User): Promise<User | null>; 
  deleteUser(id: number): Promise<boolean>; 
}
