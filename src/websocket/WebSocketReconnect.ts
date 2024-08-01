import { WebSocketClient } from './WebSocketClient';

const wsClient = new WebSocketClient('ws://meserito-backend.onrender.com');

// Ejemplo de envío de mensaje
setInterval(() => {
  wsClient.send('Hello, server!');
}, 1000000);
