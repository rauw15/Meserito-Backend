import mqtt, { MqttClient } from 'mqtt';
import { mqttConfig } from '../config';

class MqttService {
  private client: MqttClient | null = null;

  constructor() {
    // MQTT DESHABILITADO - Conexión comentada para evitar conexión automática
    /*
    this.client = mqtt.connect(mqttConfig.url, {
      clientId: mqttConfig.clientId,
      username: mqttConfig.username,
      password: mqttConfig.password,
    });

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
    });

    this.client.on('error', (err) => {
      console.error('MQTT connection error:', err);
    });
    */
    console.log('🚫 MQTT Service: Conexión deshabilitada');
  }

  publish(topic: string, message: string) {
    // MQTT DESHABILITADO - Publicación comentada
    /*
    this.client.publish(topic, message, (err) => {
      if (err) {
        console.error(`Error publishing to topic ${topic}:`, err);
      } else {
        console.log(`Message published to topic ${topic}: ${message}`);
      }
    });
    */
    console.log('🚫 MQTT Service: Intento de publicación bloqueado -', { topic, message });
  }
}

export default new MqttService();
