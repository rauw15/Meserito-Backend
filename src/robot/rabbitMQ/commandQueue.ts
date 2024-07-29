// src/robot/rabbitMQ/CommandQueue.ts
import { connectToRabbitMQ } from './rabbitMQConfig';

export const sendCommandToQueue = (command: string) => {
  connectToRabbitMQ((connection) => {
    connection.createChannel((error1, channel) => {
      if (error1) {
        throw error1;
      }
      const queue = 'robot_commands';
      channel.assertQueue(queue, { durable: false });
      channel.sendToQueue(queue, Buffer.from(command));
      console.log(`Sent command: ${command}`);
    });

    setTimeout(() => {
      connection.close();
    }, 500);
  });
};
