import express from "express";
import {
  createPedidoController,
  getAllPedidosController,
  getByIdPedidoController,
  updatePedidoController,
  deletePedidoController
} from "./dependencies";

const pedidoRouter = express.Router();

pedidoRouter.post("/create", async (req, res) => {
  try {
    await createPedidoController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

pedidoRouter.get("/getAll", async (req, res) => {
  try {
    await getAllPedidosController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

pedidoRouter.get("/get/:id", async (req, res) => {
  try {
    await getByIdPedidoController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

pedidoRouter.put("/update/:id", async (req, res) => {
  try {
    await updatePedidoController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

pedidoRouter.delete("/delete/:id", async (req, res) => {
  try {
    await deletePedidoController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

export { pedidoRouter };
