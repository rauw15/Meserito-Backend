import { Server, WebSocket as WS } from 'ws';

export class WebSocketServer {
  private wss: Server;
  private clients: Map<WS, string> = new Map(); // Mapa para almacenar usuarios por WebSocket

  constructor(port: number) {
    this.wss = new Server({ port });

    this.wss.on('connection', (ws) => {
      console.log('Client connected');

      // Enviar lista de usuarios activos al nuevo cliente
      ws.send(JSON.stringify({ type: 'connected_users', users: Array.from(this.clients.values()) }));

      // Asignar un nombre de usuario al cliente (puedes obtenerlo de alguna otra forma)
      const userName = `User${Date.now()}`; // Nombre de usuario temporal para el ejemplo
      this.clients.set(ws, userName);

      ws.on('message', (message) => {
        console.log('Received message:', message.toString());
        const data = JSON.parse(message.toString());

        switch (data.type) {
          case 'chat_message':
            this.broadcast(message.toString());
            break;
          default:
            break;
        }
      });

      ws.on('close', () => {
        console.log('Client disconnected');
        this.clients.delete(ws); // Eliminar cliente del mapa
        this.broadcastConnectedUsers();
      });

      ws.on('error', (error: Error) => {
        console.error('WebSocket error:', error);
      });
    });

    console.log(`WebSocket server is listening on ws://localhost:${port}`);
  }

  private broadcast(message: string) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WS.OPEN) {
        client.send(message);
      }
    });
  }

  private broadcastConnectedUsers() {
    const usersArray = Array.from(this.clients.values());
    this.broadcast(JSON.stringify({ type: 'connected_users', users: usersArray }));
  }
}
