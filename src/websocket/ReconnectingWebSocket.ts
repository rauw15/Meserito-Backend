import WebSocket from 'ws';

export default class ReconnectingWebSocket {
  private url: string;
  private ws: WebSocket | null = null;
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
    });
  }

  public send(message: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      console.error('WebSocket is not open');
    }
  }

  public setOnOpenHandler(handler: () => void) {
    this.ws?.on('open', handler);
  }

  public setOnMessageHandler(handler: (event: WebSocket.MessageEvent) => void) {
    this.ws?.on('message', handler);
  }

  public setOnCloseHandler(handler: () => void) {
    this.ws?.on('close', handler);
  }

  public close() {
    this.ws?.close();
  }
}
