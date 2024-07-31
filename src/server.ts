import express from 'express';
import cors from 'cors'; 
import { Signale } from 'signale';
import { connectDatabase } from './database/database';
import { userRouter } from './user/infrastructure/UserRouter';
import { productRouter } from './product/infrastructure/ProductRouter';
import { tableRouter } from './table/infraestructure/TableRouter';
import { pedidoRouter } from './pedidos/infraestructure/pedidoRouter';
import  RobotRoutes  from './robot/routes/RobotRoutes';
import { WebSocketServer } from './websocket/WebSocketServer';
import './websocket/WebSocketReconnect';

const app = express();
app.disable('x-powered-by');

const options = {
  secrets: ['([0-9]{4}-?)+']
};

const signale = new Signale(options);

// Configura CORS
const corsOptions = {
  origin: 'http://3.208.51.209', // Permite solicitudes desde esta URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite estos métodos
  allowedHeaders: ['Content-Type'], // Permite estos headers
};

app.use(cors(corsOptions)); // Usa el middleware cors
app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/tables', tableRouter);
app.use('/pedidos', pedidoRouter);
app.use('/api/robot', RobotRoutes); // Agrega las rutas para el robot

// Conexión a la base de datos
connectDatabase()
  .then(() => {
    signale.success('Connected to MongoDB.');
    app.listen(3000, () => {
      signale.success('Server online on port 3000');
    });
  })
  .catch((error: Error) => {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Iniciar servidor WebSocket sin asignar a una variable
new WebSocketServer(3001);
