# 🔌 WebSocket Sistema - Meserito

## 📋 Resumen

El sistema WebSocket de Meserito permite comunicación en tiempo real entre el servidor y los clientes. Incluye:

- ✅ **Chat en tiempo real** por mesa o general
- ✅ **Notificaciones de pedidos** automáticas
- ✅ **Gestión de usuarios** conectados
- ✅ **Reconexión automática** 
- ✅ **Integración con controladores** de pedidos

## 🚀 Configuración

### Servidor WebSocket
- **Puerto**: `3002`
- **URL**: `ws://localhost:3002`
- **Estado**: Se inicia automáticamente con `npm start`

### Cliente WebSocket
```typescript
import { WebSocketClient } from './src/websocket/WebSocketClient';

const client = new WebSocketClient('ws://localhost:3002');
```

## 📨 Tipos de Mensajes

### 1. Chat
```javascript
// Enviar mensaje de chat
client.sendChatMessage("¡Hola a todos!");

// Recibir mensajes de chat
client.onChatMessage((data) => {
  console.log(`${data.userName}: ${data.message}`);
});
```

### 2. Información de Usuario
```javascript
// Configurar usuario
client.setUserInfo("Juan Pérez", "customer");

// Unirse a una mesa
client.joinTable("mesa-01");
```

### 3. Pedidos
```javascript
// Actualizar estado de pedido
client.sendOrderUpdate("pedido-123", "en_preparacion", "mesa-01");

// Recibir notificaciones de pedidos
client.onOrderNotification((data) => {
  console.log(`Pedido actualizado: ${data.message}`);
});
```

### 4. Notificaciones Generales
```javascript
// Recibir notificaciones
client.onNotification((data) => {
  console.log(`Notificación: ${data.message}`);
});
```

## 🎯 Eventos Disponibles

| Evento | Descripción | Datos |
|--------|-------------|-------|
| `welcome` | Bienvenida al conectar | `{clientId, message}` |
| `chat_message` | Mensaje de chat | `{userName, message, timestamp, tableId}` |
| `order_notification` | Actualización de pedido | `{orderId, status, message, tableId}` |
| `connected_users` | Lista de usuarios | `{users, count}` |
| `notification` | Notificación general | `{message, timestamp}` |
| `table_joined` | Usuario se unió a mesa | `{tableId, message}` |
| `user_joined_table` | Otro usuario se unió | `{userName, tableId}` |

## 🔧 Métodos del Cliente

### Conexión
```javascript
client.isWebSocketConnected()  // boolean
client.getClientId()          // string
client.getUserName()          // string
client.ping()                 // health check
```

### Comunicación
```javascript
client.sendChatMessage(mensaje)
client.setUserInfo(nombre, rol)
client.joinTable(mesaId)
client.sendOrderUpdate(pedidoId, estado, mesaId, mensaje)
```

### Event Handlers
```javascript
client.onWelcome(handler)
client.onChatMessage(handler)
client.onOrderNotification(handler)
client.onConnectedUsers(handler)
client.onNotification(handler)
client.onError(handler)
```

## 🏗️ Integración con Backend

### Desde Controladores
```typescript
import { globalWebSocketServer } from '../../../server';

// Notificar actualización de pedido
globalWebSocketServer?.notifyOrderUpdate(
  pedidoId, 
  'preparado', 
  mesaId, 
  'Tu pedido está listo'
);

// Enviar notificación general
globalWebSocketServer?.sendNotification(
  'Nueva promoción disponible!',
  mesaId // opcional - solo a esta mesa
);
```

## 🧪 Pruebas

### 1. Iniciar el servidor
```bash
npm start
```

### 2. Ver logs del WebSocket
Los logs mostrarán:
- ✅ Conexiones de clientes
- 📨 Mensajes enviados/recibidos
- 🔄 Actualizaciones de pedidos
- 👥 Usuarios conectados

### 3. Cliente de prueba
El archivo `WebSocketReconnect.ts` se ejecuta automáticamente y demuestra todas las funcionalidades.

## 🌟 Características Avanzadas

### Reconexión Automática
- **Intentos máximos**: 10
- **Intervalo**: 5 segundos
- **Detección automática** de desconexión

### Gestión por Mesa
- Los usuarios pueden unirse a mesas específicas
- Los mensajes se pueden enviar solo a una mesa
- Las notificaciones de pedidos van a la mesa correcta

### Estados de Pedido
| Estado | Descripción |
|--------|-------------|
| `creado` | Pedido recién creado |
| `pendiente` | Esperando preparación |
| `en_preparacion` | Siendo preparado |
| `preparado` | Listo para entregar |
| `entregado` | Entregado al cliente |
| `pagado` | Pagado |
| `cancelado` | Cancelado |

## 📱 Para el Frontend

Cuando conectes el frontend, usa estas URLs:
- **Desarrollo**: `ws://localhost:3002`
- **Producción**: `wss://tu-dominio.com:3002`

### Ejemplo React/JavaScript
```javascript
const socket = new WebSocket('ws://localhost:3002');

socket.onopen = () => {
  console.log('Conectado al WebSocket');
  // Configurar usuario
  socket.send(JSON.stringify({
    type: 'set_user_info',
    userName: 'Cliente Web',
    role: 'customer'
  }));
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  
  switch(data.type) {
    case 'order_notification':
      showNotification(data.message);
      break;
    case 'chat_message':
      addChatMessage(data);
      break;
    // ... más casos
  }
};
```

## 🔍 Troubleshooting

### Error 301 - Redirect
- ✅ **Solucionado**: Cambiamos la URL a `localhost:3002`

### Conexión fallida
1. Verificar que el servidor esté corriendo
2. Comprobar el puerto 3002
3. Revisar logs del servidor

### Mensajes no llegan
1. Verificar que el cliente esté conectado
2. Usar `client.ping()` para probar conexión
3. Revisar formato de mensajes JSON

---

🎉 **¡Tu sistema WebSocket está listo!** Ahora tienes comunicación en tiempo real totalmente funcional para tu aplicación Meserito. 