import { CreateProductUseCase } from '../application/CreateProductUseCase';
import { GetAllProductUseCase } from '../application/GetAllProductUseCase';
import { GetByIdProductUseCase } from '../application/GetByIdProductUseCase';
import { UpdateProductUseCase } from '../application/UpdateProductUseCase';
import { DeleteProductUseCase } from '../application/DeleteProductUseCase';

import { CreateProductController } from './controllers/CreateProductController';
import { GetAllProductController } from './controllers/GetAllProductController';
import { GetByIdProductController } from './controllers/GetByIdProductController';
import { UpdateProductController } from './controllers/UpdateProductController';
import { DeleteProductController } from './controllers/DeleteProductController';

import { ProductMongoRepository } from '../infrastructure/databaseProductRepository';

// Instancias de los casos de uso
const createProductUseCase = new CreateProductUseCase(new ProductMongoRepository());
const getAllProductsUseCase = new GetAllProductUseCase(new ProductMongoRepository());
const getByIdProductUseCase = new GetByIdProductUseCase(new ProductMongoRepository());
const updateProductUseCase = new UpdateProductUseCase(new ProductMongoRepository());
const deleteProductUseCase = new DeleteProductUseCase(new ProductMongoRepository());

// Instancias de los controladores
const createProductController = new CreateProductController(createProductUseCase);
const getAllProductController = new GetAllProductController(getAllProductsUseCase);
const getByIdProductController = new GetByIdProductController(getByIdProductUseCase);
const updateProductController = new UpdateProductController(updateProductUseCase);
const deleteProductController = new DeleteProductController(deleteProductUseCase);

export {
  createProductController,
  getAllProductController,
  getByIdProductController,
  updateProductController,
  deleteProductController,
};
