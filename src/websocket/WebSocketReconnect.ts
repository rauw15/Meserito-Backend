import { WebSocketClient } from './WebSocketClient';

const wsClient = new WebSocketClient('wss://meserito-backend.onrender.com');

// Ejemplo de envío de mensaje
setInterval(() => {
  wsClient.send('Hello, server!');
}, 1000000);
