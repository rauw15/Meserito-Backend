import { TableMongoRepository } from "./TableMongoRepository";
import { CreateTableUseCase } from "../application/CreateTableUseCase";
import { GetAllTablesUseCase } from "../application/GetAllTablesUseCase";
import { GetByIdTableUseCase } from "../application/GetByIdTableUseCase";
import { UpdateTableUseCase } from "../application/UpdateTableUseCase";
import { DeleteTableUseCase } from "../application/DeleteTableUseCase";
import { SeparateBillUseCase } from "../application/SeparateBillsUseCase";
import { AssignUserToTableUseCase } from "../application/AssignUserToTableUseCase";

import { CreateTableController } from "./controller/CreateTableController";
import { GetAllTablesController } from "./controller/GetAllTablesController";
import { GetByIdTableController } from "./controller/GetByIdTableController";
import { UpdateTableController } from "./controller/UpdateTableController";
import { DeleteTableController } from "./controller/DeleteTableController";
import { SeparateBillController } from "./controller/SeparateBillsController";
import { AssignUserToTableController } from "./controller/AssignUserToTableController";

const tableRepository = new TableMongoRepository();

// Instancias de los casos de uso
const createTableUseCase = new CreateTableUseCase(tableRepository);
const getAllTablesUseCase = new GetAllTablesUseCase(tableRepository);
const getByIdTableUseCase = new GetByIdTableUseCase(tableRepository);
const updateTableUseCase = new UpdateTableUseCase(tableRepository);
const deleteTableUseCase = new DeleteTableUseCase(tableRepository);
const separateBillUseCase = new SeparateBillUseCase(tableRepository);
const assignUserToTableUseCase = new AssignUserToTableUseCase(tableRepository);

// Instancias de los controladores
const createTableController = new CreateTableController(createTableUseCase);
const getAllTablesController = new GetAllTablesController(getAllTablesUseCase);
const getByIdTableController = new GetByIdTableController(getByIdTableUseCase);
const updateTableController = new UpdateTableController(updateTableUseCase);
const deleteTableController = new DeleteTableController(deleteTableUseCase);
const separateBillController = new SeparateBillController(separateBillUseCase);
const assignUserToTableController = new AssignUserToTableController(assignUserToTableUseCase);

export {
  createTableController,
  getAllTablesController,
  getByIdTableController,
  updateTableController,
  deleteTableController,
  separateBillController,
  assignUserToTableController,
};
