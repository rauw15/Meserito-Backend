import mqtt, { MqttClient } from 'mqtt';
import { mqttConfig } from '../config';

class MqttService {
  private client: MqttClient;

  constructor() {
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
  }

  publish(topic: string, message: string) {
    this.client.publish(topic, message);
  }
}

export default new MqttService();
