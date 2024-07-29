import { CreateUserUseCase } from "../application/CreateUserUseCase";
import { GetAllUserUseCase } from "../application/GetAllUsersUseCase";
import { CreateUserController } from "./controllers/CreateUserController";
import { GetAllUserController } from "./controllers/GetAllUserController";
import { UserMongoRepository } from "./databaseUserRepository";
import { GetByIdUserUseCase } from "../application/GetByIdUserUseCase";
import { GetByIdUserController } from "./controllers/GetByIdUserController";
import { UpdateUserUseCase } from "../application/UpdateUserUseCase";
import { UpdateUserController } from "./controllers/UpdateUserController";
import { DeleteUserUseCase } from "../application/DeleteUserUseCase";
import { DeleteUserController } from "./controllers/DeleteUserController";
import { LoginUserUseCase } from "../application/LoginUserUseCase"; 
import { LoginUserController } from "./controllers/LoginUserController"; 

const userMongoRepository = new UserMongoRepository();

// Use Cases
export const createUserUseCase = new CreateUserUseCase(userMongoRepository);
export const getAllUserUseCase = new GetAllUserUseCase(userMongoRepository);
export const getByIdUserUseCase = new GetByIdUserUseCase(userMongoRepository);
export const updateUserUseCase = new UpdateUserUseCase(userMongoRepository);
export const deleteUserUseCase = new DeleteUserUseCase(userMongoRepository);
export const loginUseCase = new LoginUserUseCase(userMongoRepository); 

// Controllers
export const createUserController = new CreateUserController(createUserUseCase);
export const getAllUserController = new GetAllUserController(getAllUserUseCase);
export const getByIdUserController = new GetByIdUserController(getByIdUserUseCase);
export const updateUserController = new UpdateUserController(updateUserUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUseCase);
export const loginController = new LoginUserController(loginUseCase); 
