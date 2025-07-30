import WebSocket from 'ws';

interface MessageHandlers {
  onWelcome?: (data: any) => void;
  onChatMessage?: (data: any) => void;
  onOrderNotification?: (data: any) => void;
  onConnectedUsers?: (data: any) => void;
  onNotification?: (data: any) => void;
  onError?: (data: any) => void;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval: number;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 10;
  private handlers: MessageHandlers = {};
  private isConnected: boolean = false;
  private clientId: string | null = null;
  private userName: string | null = null;

  constructor(url: string, reconnectInterval: number = 5000) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.connect();
  }

  private connect() {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error(`❌ Max reconnect attempts (${this.maxReconnectAttempts}) reached.`);
      return;
    }

    if (this.reconnectAttempts > 0) {
      console.log(`🔄 Reintentando conexión... (intento ${this.reconnectAttempts + 1})`);
    }
    this.ws = new WebSocket(this.url);

    this.ws.on('open', () => {
      console.log('✅ WebSocket conectado');
      this.isConnected = true;
      this.reconnectAttempts = 0;
      
      // Enviar ping para verificar conexión
      this.sendMessage({ type: 'ping' });
    });

    this.ws.on('close', () => {
      if (this.isConnected) {
        console.log('❌ WebSocket desconectado');
      }
      this.isConnected = false;
      this.clientId = null;
      
      if (this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        setTimeout(() => this.connect(), this.reconnectInterval);
      }
    });

    this.ws.on('error', (error: Error) => {
      console.error('❌ WebSocket error:', error.message);
      this.isConnected = false;
      this.ws?.close();
    });

    this.ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        this.handleMessage(data);
      } catch (error) {
        console.error('❌ Error parsing WebSocket message:', error);
      }
    });
  }

  private handleMessage(data: any) {
    // Solo mostrar logs para mensajes importantes, no para todos
    
    switch (data.type) {
      case 'welcome':
        this.clientId = data.clientId;
        this.handlers.onWelcome?.(data);
        break;

      case 'chat_message':
        this.handlers.onChatMessage?.(data);
        break;

      case 'order_notification':
        this.handlers.onOrderNotification?.(data);
        break;

      case 'connected_users':
        this.handlers.onConnectedUsers?.(data);
        break;

      case 'notification':
        this.handlers.onNotification?.(data);
        break;

      case 'error':
        console.error(`❌ Server error: ${data.message}`);
        this.handlers.onError?.(data);
        break;

      case 'pong':
        // Ping/pong silencioso - no mostrar logs
        break;

      case 'user_info_updated':
        this.userName = data.userName;
        break;

      case 'table_joined':
        console.log(`🪑 Unido a mesa: ${data.tableId}`);
        break;

      case 'user_joined_table':
        console.log(`👋 ${data.userName} se unió a mesa ${data.tableId}`);
        break;

      default:
        console.log(`❓ Mensaje desconocido: ${data.type}`);
        break;
    }
  }

  // Método genérico para enviar mensajes
  private sendMessage(data: any): boolean {
    if (!this.isConnected || this.ws?.readyState !== WebSocket.OPEN) {
      console.error('❌ Cannot send message: WebSocket is not connected');
      return false;
    }

    try {
      this.ws.send(JSON.stringify(data));
      return true;
    } catch (error) {
      console.error('❌ Error sending message:', error);
      return false;
    }
  }

  // Métodos públicos específicos para diferentes tipos de mensajes

  public sendChatMessage(message: string): boolean {
    return this.sendMessage({
      type: 'chat_message',
      message: message
    });
  }

  public setUserInfo(userName: string, role?: string): boolean {
    return this.sendMessage({
      type: 'set_user_info',
      userName: userName,
      role: role
    });
  }

  public joinTable(tableId: string): boolean {
    return this.sendMessage({
      type: 'join_table',
      tableId: tableId
    });
  }

  public sendOrderUpdate(orderId: string, status: string, tableId?: string, message?: string): boolean {
    return this.sendMessage({
      type: 'order_update',
      orderId: orderId,
      status: status,
      tableId: tableId,
      message: message
    });
  }

  public ping(): boolean {
    return this.sendMessage({ type: 'ping' });
  }

  // Método genérico para envío de mensajes (mantener compatibilidad)
  public send(message: string): boolean {
    return this.sendChatMessage(message);
  }

  // Métodos para configurar handlers de eventos
  public onWelcome(handler: (data: any) => void): void {
    this.handlers.onWelcome = handler;
  }

  public onChatMessage(handler: (data: any) => void): void {
    this.handlers.onChatMessage = handler;
  }

  public onOrderNotification(handler: (data: any) => void): void {
    this.handlers.onOrderNotification = handler;
  }

  public onConnectedUsers(handler: (data: any) => void): void {
    this.handlers.onConnectedUsers = handler;
  }

  public onNotification(handler: (data: any) => void): void {
    this.handlers.onNotification = handler;
  }

  public onError(handler: (data: any) => void): void {
    this.handlers.onError = handler;
  }

  // Métodos de utilidad
  public isWebSocketConnected(): boolean {
    return this.isConnected;
  }

  public getClientId(): string | null {
    return this.clientId;
  }

  public getUserName(): string | null {
    return this.userName;
  }

  public disconnect(): void {
    this.maxReconnectAttempts = 0; // Evitar reconexión automática
    this.ws?.close();
  }

  public reconnect(): void {
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.connect();
  }
}
