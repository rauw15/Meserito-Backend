/// <reference path="../@types/express.d.ts" />
import express from 'express';
import cors from 'cors'; 
import { Signale } from 'signale';
import { connectDatabase } from './database/database';
import { userRouter } from './user/infrastructure/UserRouter';
import { productRouter } from './product/infrastructure/ProductRouter';
import { tableRouter } from './table/infraestructure/TableRouter';
import { pedidoRouter } from './pedidos/infraestructure/pedidoRouter';
// import  RobotRoutes  from './robot/routes/RobotRoutes'; // MQTT DESHABILITADO
import { WebSocketServer } from './websocket/WebSocketServer';
import './websocket/WebSocketReconnect';
import cron from 'node-cron';
import { sendTestEmail } from './cron/emailService'; 

const app = express();
app.disable('x-powered-by');

const options = {
  secrets: ['([0-9]{4}-?)+']
};

const signale = new Signale(options);

// Configura CORS
const corsOptions = {
  origin: '*', // Permite solicitudes desde cualquier origen para pruebas
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Permite estos métodos
  allowedHeaders: ['Content-Type', 'Authorization'], // Permite estos headers
};

app.use(cors(corsOptions)); // Usa el middleware cors
app.use(express.json());
app.use('/users', userRouter);
app.use('/products', productRouter);
app.use('/tables', tableRouter);
app.use('/pedidos', pedidoRouter);
// app.use('/api/robot', RobotRoutes); // MQTT DESHABILITADO - Rutas del robot comentadas

// Configuración del cron job para enviar un correo de prueba cada minuto
cron.schedule('* * * * *', async () => {
  try {
    await sendTestEmail('rmimiagavasquez@gmail.com', 'Correo de Prueba', 'Este es un correo de prueba enviado por el cron job.');
    // console.log('Correo de prueba enviado con éxito');
  } catch (error) {
    // Solo mostrar errores importantes, no el spam de cada minuto
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      // Error común de SendGrid - no mostrar cada minuto
    } else {
      console.error('Error al enviar el correo de prueba:', error);
    }
  }
});


// Configuración del cron job para realizar una consulta simple a la base de datos cada minuto
cron.schedule('* * * * *', async () => {
  try {
    await connectDatabase(); // Conéctate a la base de datos
    // console.log('Conexión a la base de datos establecida correctamente');
  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
  }
});

// Configuración del cron job para registrar un mensaje en la consola cada minuto
cron.schedule('* * * * *', () => {
  // console.log('Cron job ejecutado: ' + new Date().toLocaleString());
});

// Variable global para el WebSocket server
let globalWebSocketServer: WebSocketServer | null = null;

console.log('\n🚀 ===== INICIANDO SERVIDOR MESERITO ===== 🚀\n');

// Conexión a la base de datos
connectDatabase()
  .then(() => {
    console.log('✅ ===== CONEXIÓN A MONGODB EXITOSA ===== ✅');
    signale.success('Connected to MongoDB.');
    
    app.listen(30000, () => {
      console.log('🌐 ===== SERVIDOR HTTP INICIADO ===== 🌐');
      signale.success('Server online on port 30000');
      console.log('📍 HTTP Server: http://localhost:30000');
      console.log('');
    });
  })
  .catch((error: Error) => {
    console.error('❌ ===== ERROR CONECTANDO A MONGODB ===== ❌');
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1);
  });

// Iniciar servidor WebSocket y guardar referencia global
console.log('🔌 ===== INICIANDO SERVIDOR WEBSOCKET ===== 🔌');
globalWebSocketServer = new WebSocketServer(3002);
console.log('📍 WebSocket Server: ws://localhost:3002');
console.log('\n🎉 ===== TODOS LOS SERVICIOS INICIADOS ===== 🎉\n');

// Exportar la instancia del WebSocket server para uso en otros módulos
export { globalWebSocketServer };
