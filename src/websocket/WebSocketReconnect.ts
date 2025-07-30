import { WebSocketClient } from './WebSocketClient';

// Cambiamos a localhost ya que el servidor WebSocket está corriendo localmente en puerto 3002
const wsClient = new WebSocketClient('ws://localhost:3002');

// Configurar handlers para diferentes tipos de mensajes
wsClient.onWelcome((data) => {
  console.log('🎉 WebSocket conectado exitosamente');
  
  // Configurar información del usuario después de conectar
  wsClient.setUserInfo('Usuario_Demo', 'customer');
});

wsClient.onChatMessage((data) => {
  console.log(`💬 Chat: ${data.userName}: "${data.message}"`);
});

wsClient.onOrderNotification((data) => {
  console.log(`🍽️ Pedido: ${data.message}`);
});

wsClient.onConnectedUsers((data) => {
  // Solo mostrar cuando cambie el número de usuarios significativamente
  if (data.count <= 2) {
    console.log(`👥 Usuarios conectados: ${data.count}`);
  }
});

wsClient.onNotification((data) => {
  console.log(`🔔 ${data.message}`);
});

wsClient.onError((data) => {
  console.error(`❌ Error: ${data.message}`);
});

// Ejemplo de funcionalidades - se ejecutarán después de conectar
setTimeout(() => {
  if (wsClient.isWebSocketConnected()) {
    console.log('📨 Enviando mensaje de prueba...');
    
    // Enviar un mensaje de chat
    wsClient.sendChatMessage('¡WebSocket funcionando correctamente!');
    
    // Simular actualización de pedido
    wsClient.sendOrderUpdate('demo-123', 'funcionando', 'demo-mesa', 'Sistema WebSocket operativo');
  }
}, 3000);

// Ejemplo de envío periódico de mensajes (descomentado para pruebas)
// setInterval(() => {
//   if (wsClient.isWebSocketConnected()) {
//     wsClient.sendChatMessage(`Mensaje automático - ${new Date().toLocaleTimeString()}`);
//   }
// }, 10000);

console.log('🔌 Inicializando cliente WebSocket...');

// Exportar cliente para uso en otros módulos si es necesario
export { wsClient };
