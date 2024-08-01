// reconnecting-websocket.ts
class ReconnectingWebSocket {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectInterval: number = 5000; // Intervalo de reconexión en ms
  private onOpenHandler: () => void = () => {};
  private onMessageHandler: (event: MessageEvent) => void = () => {};
  private onCloseHandler: () => void = () => {};

  constructor(url: string) {
    this.url = url;
    this.connect();
  }

  private connect() {
    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.onOpenHandler();
    };

    this.ws.onmessage = (event) => {
      this.onMessageHandler(event);
    };

    this.ws.onclose = () => {
      this.onCloseHandler();
      setTimeout(() => this.connect(), this.reconnectInterval);
    };

    this.ws.onerror = (err) => {
      console.error('WebSocket error', err);
      this.ws?.close();
    };
  }

  setOnOpenHandler(handler: () => void) {
    this.onOpenHandler = handler;
  }

  setOnMessageHandler(handler: (event: MessageEvent) => void) {
    this.onMessageHandler = handler;
  }

  setOnCloseHandler(handler: () => void) {
    this.onCloseHandler = handler;
  }

  send(data: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(data);
    } else {
      console.error('WebSocket no está abierto. Estado de ReadyState:', this.ws?.readyState);
    }
  }

  close() {
    this.ws?.close();
  }
}

export default ReconnectingWebSocket;
