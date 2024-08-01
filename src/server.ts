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
import dotenv from 'dotenv';
import http from 'http';
import cron from 'node-cron';
import { sendTestEmail } from './cron/emailService'; 

dotenv.config();

const app = express();
app.disable('x-powered-by');

const options = {
  secrets: ['([0-9]{4}-?)+']
};

const server = http.createServer(app); 

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

// Configuración del cron job para enviar un correo de prueba cada minuto
cron.schedule('* * * * *', async () => {
  try {
    await sendTestEmail('rmimiagavasquez@gmail.com', 'Correo de Prueba', 'Este es un correo de prueba enviado por el cron job.');
    console.log('Correo de prueba enviado con éxito');
  } catch (error) {
    console.error('Error al enviar el correo de prueba:', error);
  }
});

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

// Iniciar WebSocketServer con el servidor HTTP
const websocketUrl = process.env.NODE_ENV === 'production' ? process.env.WS_URL_PROD : process.env.WS_URL_DEV;

if (!websocketUrl) {
  throw new Error('WebSocket URL is not defined in the environment variables.');
}

const wss = new WebSocketServer();
wss.start(server); // Método para iniciar el WebSocketServer con el servidor HTTP

server.listen(3000, () => {
  signale.success('Server online on port 3000');
});
