import WebSocket from 'ws';

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private readonly url: string;
  private reconnectInterval: number;

  constructor(url: string, reconnectInterval: number = 5000) {
    this.url = url;
    this.reconnectInterval = reconnectInterval;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.on('open', () => {
      console.log('WebSocket connected');
    });

    this.ws.on('close', () => {
      console.log('WebSocket disconnected, attempting to reconnect');
      setTimeout(() => this.connect(), this.reconnectInterval);
    });

    this.ws.on('error', (error: Error) => {
      console.error('WebSocket error:', error);
      this.ws?.close();
    });

    this.ws.on('message', (message) => {
      console.log('Received message:', message.toString());
      // Maneja el mensaje recibido aquí
    });
  }

  public send(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }
}
