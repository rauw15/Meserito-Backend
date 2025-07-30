import { Server, WebSocket as WS } from 'ws';

interface ClientInfo {
  id: string;
  userName: string;
  role?: string;
  tableId?: string;
  connectedAt: Date;
}

export class WebSocketServer {
  private wss: Server;
  private clients: Map<WS, ClientInfo> = new Map();

  constructor(port: number) {
    this.wss = new Server({ port });

    this.wss.on('connection', (ws) => {
      const clientId = this.generateClientId();
      console.log(`🔗 Cliente conectado: ${clientId}`);

      // Inicializar información del cliente
      const clientInfo: ClientInfo = {
        id: clientId,
        userName: `Usuario${clientId.slice(-4)}`,
        connectedAt: new Date()
      };
      
      this.clients.set(ws, clientInfo);

      // Enviar bienvenida al cliente
      this.sendToClient(ws, {
        type: 'welcome',
        clientId: clientId,
        message: 'Conectado al servidor WebSocket de Meserito'
      });

      // Enviar lista de usuarios conectados
      this.broadcastConnectedUsers();

      ws.on('message', (message) => {
        try {
          const data = JSON.parse(message.toString());
          this.handleMessage(ws, data);
        } catch (error) {
          console.error('❌ Error parsing message:', error);
          this.sendToClient(ws, {
            type: 'error',
            message: 'Formato de mensaje inválido'
          });
        }
      });

      ws.on('close', () => {
        console.log(`❌ Cliente desconectado: ${clientId}`);
        this.clients.delete(ws);
        this.broadcastConnectedUsers();
      });

      ws.on('error', (error: Error) => {
        console.error(`❌ WebSocket error for client ${clientId}:`, error.message);
        this.clients.delete(ws);
      });
    });

    console.log(`✅ WebSocket server listening on ws://localhost:${port}`);
  }

  private generateClientId(): string {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private handleMessage(ws: WS, data: any) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    // Solo mostrar logs para mensajes importantes
    if (data.type !== 'ping' && data.type !== 'set_user_info') {
      console.log(`📨 ${clientInfo.userName}: ${data.type}`);
    }

    switch (data.type) {
      case 'chat_message':
        this.handleChatMessage(ws, data);
        break;
      
      case 'set_user_info':
        this.handleSetUserInfo(ws, data);
        break;
      
      case 'join_table':
        this.handleJoinTable(ws, data);
        break;
      
      case 'order_update':
        this.handleOrderUpdate(data);
        break;
      
      case 'ping':
        this.sendToClient(ws, { type: 'pong', timestamp: Date.now() });
        break;
      
      default:
        console.log(`❓ Tipo de mensaje desconocido: ${data.type}`);
        this.sendToClient(ws, {
          type: 'error',
          message: `Tipo de mensaje desconocido: ${data.type}`
        });
        break;
    }
  }

  private handleChatMessage(ws: WS, data: any) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    const chatMessage = {
      type: 'chat_message',
      id: Date.now(),
      userName: clientInfo.userName,
      message: data.message,
      timestamp: new Date().toISOString(),
      tableId: clientInfo.tableId
    };

    // Si tiene tableId, enviar solo a esa mesa, si no, broadcast general
    if (clientInfo.tableId) {
      this.broadcastToTable(clientInfo.tableId, chatMessage);
    } else {
      this.broadcast(JSON.stringify(chatMessage));
    }
  }

  private handleSetUserInfo(ws: WS, data: any) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    // Actualizar información del usuario
    if (data.userName) clientInfo.userName = data.userName;
    if (data.role) clientInfo.role = data.role;
    
    this.clients.set(ws, clientInfo);
    
    this.sendToClient(ws, {
      type: 'user_info_updated',
      clientId: clientInfo.id,
      userName: clientInfo.userName,
      role: clientInfo.role
    });

    this.broadcastConnectedUsers();
  }

  private handleJoinTable(ws: WS, data: any) {
    const clientInfo = this.clients.get(ws);
    if (!clientInfo) return;

    clientInfo.tableId = data.tableId;
    this.clients.set(ws, clientInfo);

    this.sendToClient(ws, {
      type: 'table_joined',
      tableId: data.tableId,
      message: `Te has unido a la mesa ${data.tableId}`
    });

    // Notificar a otros en la misma mesa
    this.broadcastToTable(data.tableId, {
      type: 'user_joined_table',
      userName: clientInfo.userName,
      tableId: data.tableId
    }, ws);
  }

  private handleOrderUpdate(data: any) {
    // Broadcast order updates to relevant clients
    const orderNotification = {
      type: 'order_notification',
      orderId: data.orderId,
      status: data.status,
      tableId: data.tableId,
      message: data.message || `Pedido ${data.orderId} actualizado a: ${data.status}`,
      timestamp: new Date().toISOString()
    };

    if (data.tableId) {
      this.broadcastToTable(data.tableId, orderNotification);
    } else {
      this.broadcast(JSON.stringify(orderNotification));
    }
  }

  private sendToClient(ws: WS, data: any) {
    if (ws.readyState === WS.OPEN) {
      ws.send(JSON.stringify(data));
    }
  }

  private broadcast(message: string, excludeClient?: WS) {
    this.wss.clients.forEach((client) => {
      if (client !== excludeClient && client.readyState === WS.OPEN) {
        client.send(message);
      }
    });
  }

  private broadcastToTable(tableId: string, data: any, excludeClient?: WS) {
    const message = JSON.stringify(data);
    this.clients.forEach((clientInfo, ws) => {
      if (clientInfo.tableId === tableId && 
          ws !== excludeClient && 
          ws.readyState === WS.OPEN) {
        ws.send(message);
      }
    });
  }

  private broadcastConnectedUsers() {
    const usersArray = Array.from(this.clients.values()).map(client => ({
      id: client.id,
      userName: client.userName,
      role: client.role,
      tableId: client.tableId,
      connectedAt: client.connectedAt
    }));

    this.broadcast(JSON.stringify({ 
      type: 'connected_users', 
      users: usersArray,
      count: usersArray.length
    }));
  }

  // Método público para enviar notificaciones desde otros módulos
  public notifyOrderUpdate(orderId: string, status: string, tableId?: string, message?: string) {
    this.handleOrderUpdate({
      orderId,
      status,
      tableId,
      message
    });
  }

  // Método público para enviar notificaciones generales
  public sendNotification(message: string, tableId?: string) {
    const notification = {
      type: 'notification',
      message,
      timestamp: new Date().toISOString()
    };

    if (tableId) {
      this.broadcastToTable(tableId, notification);
    } else {
      this.broadcast(JSON.stringify(notification));
    }
  }
}
