import express from "express";
import multer from "multer";
import path from "path";
import {
  getAllProductController,
  createProductController,
  getByIdProductController,
  updateProductController,
  deleteProductController
} from "./dependencies";

// Configurar multer para manejar subidas de archivos
const upload = multer({ dest: "uploads/" });

const app = express();

// Servir archivos estáticos desde la carpeta 'uploads'
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

export const productRouter = express.Router();

productRouter.get("/getAll", async (req, res) => {
  try {
    await getAllProductController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productRouter.post("/create", upload.single("image"), async (req, res) => {
  try {
    await createProductController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productRouter.get("/get/:id", async (req, res) => {
  try {
    await getByIdProductController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productRouter.put("/update/:id", async (req, res) => {
  try {
    await updateProductController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

productRouter.delete("/delete/:id", async (req, res) => {
  try {
    await deleteProductController.run(req, res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});
