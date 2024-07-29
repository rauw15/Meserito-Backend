// src/robot/services/RobotService.ts
import { sendCommandToQueue } from '../rabbitMQ/commandQueue';

export const moveToColor = (color: string) => {
  const command = `MOVE_TO_COLOR:${color}`;
  sendCommandToQueue(command);
};

export const deliverOrder = () => {
  const command = 'DELIVER_ORDER';
  sendCommandToQueue(command);
};
