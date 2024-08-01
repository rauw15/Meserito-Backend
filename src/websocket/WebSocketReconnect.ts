import { WebSocketClient } from './WebSocketClient';

const wsClient = new WebSocketClient('ws://localhost:3001');

// Ejemplo de envío de mensaje
setInterval(() => {
  wsClient.send('Hello, server!');
}, 1000000);
