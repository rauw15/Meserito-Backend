import amqp from 'amqplib/callback_api';

export const connectToRabbitMQ = (callback: (conn: amqp.Connection) => void) => {
  amqp.connect('amqp://localhost', (error0, connection) => {
    if (error0) {
      throw error0;
    }
    callback(connection);
  });
};
