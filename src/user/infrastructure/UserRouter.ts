import express from "express";
import {
  getAllUserController,
  createUserController,
  getByIdUserController,
  updateUserController,
  deleteUserController,
  loginController, 
} from "./dependencies";

export const userRouter = express.Router();

userRouter.get("/get", async (req, res) => {
  try {
    await getAllUserController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

userRouter.post("/create", async (req, res) => {
  try {
    await createUserController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

userRouter.get("/getById", async (req, res) => {
  try {
    await getByIdUserController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Rutas para actualizar y eliminar usuarios
userRouter.put("/update/:id", async (req, res) => {
  try {
    await updateUserController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

userRouter.delete("/delete/:id", async (req, res) => {
  try {
    await deleteUserController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

// Ruta para el inicio de sesión
userRouter.post("/login", async (req, res) => {
  try {
    await loginController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});
