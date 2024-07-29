import express from "express";
import {
  createTableController,
  getAllTablesController,
  getByIdTableController,
  updateTableController,
  deleteTableController,
  separateBillController,
  assignUserToTableController
} from "./dependencies";

const tableRouter = express.Router();

tableRouter.post("/create", async (req, res) => {
  try {
    await createTableController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.get("/getAll", async (req, res) => {
  try {
    await getAllTablesController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.get("/get/:id", async (req, res) => {
  try {
    await getByIdTableController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.put("/update/:id", async (req, res) => {
  try {
    await updateTableController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.delete("/delete/:id", async (req, res) => {
  try {
    await deleteTableController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.post("/separate-bill/:id", async (req, res) => {
  try {
    await separateBillController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

tableRouter.post("/assign-user/:id", async (req, res) => {
  try {
    await assignUserToTableController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

export { tableRouter };
