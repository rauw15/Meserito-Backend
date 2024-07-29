import { CreatePedidoUseCase } from '../application/CreatePedidoUseCase';
import { GetAllPedidosUseCase } from '../application/GetAllPedidosUseCase';
import { GetByIdPedidoUseCase } from '../application/GetByIdPedidoUseCase';
import { UpdatePedidoUseCase } from '../application/UpdatePedidoUseCase';
import { DeletePedidoUseCase } from '../application/DeletePedidoUseCase';
import { PedidoMongoRepository } from './repositorioPedidoMongo';

import { CreatePedidoController } from './controller/CreatePedidoController';
import { GetAllPedidosController } from './controller/GetAllPedidosController';
import { GetByIdPedidoController } from './controller/GetByIdPedidoController';
import { UpdatePedidoController } from './controller/UpdatePedidoController';
import { DeletePedidoController } from './controller/DeletePedidoController';

const pedidoRepository = new PedidoMongoRepository();

const createPedidoUseCase = new CreatePedidoUseCase(pedidoRepository);
const getAllPedidosUseCase = new GetAllPedidosUseCase(pedidoRepository);
const getByIdPedidoUseCase = new GetByIdPedidoUseCase(pedidoRepository);
const updatePedidoUseCase = new UpdatePedidoUseCase(pedidoRepository);
const deletePedidoUseCase = new DeletePedidoUseCase(pedidoRepository);

const createPedidoController = new CreatePedidoController(createPedidoUseCase);
const getAllPedidosController = new GetAllPedidosController(getAllPedidosUseCase);
const getByIdPedidoController = new GetByIdPedidoController(getByIdPedidoUseCase);
const updatePedidoController = new UpdatePedidoController(updatePedidoUseCase);
const deletePedidoController = new DeletePedidoController(deletePedidoUseCase);

export {
  createPedidoController,
  getAllPedidosController,
  getByIdPedidoController,
  updatePedidoController,
  deletePedidoController
};
