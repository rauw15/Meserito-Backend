// services/RobotService.ts
import MqttService from './MqttService';
import { RobotCommand } from '../models/RobotCommand';

class RobotService {
  sendCommand(command: RobotCommand) {
    let topic: string;

    switch (command.action) {
      case 'move_forward':
        topic = 'robot/commands/move_forward';
        break;
      case 'stop':
        topic = 'robot/commands/stop';
        break;
      case 'rotate_left':
        topic = 'robot/commands/rotate_left';
        break;
      case 'rotate_right':
        topic = 'robot/commands/rotate_right';
        break;
      case 'search_color':
        topic = 'robot/commands/search_color';
        break;
      case 'return':
        topic = 'robot/commands/return';
        break;
      case 'check_distance':
        topic = 'robot/commands/check_distance';
        break;
      default:
        throw new Error('Unknown command action');
    }

    MqttService.publish(topic, JSON.stringify(command));
  }
}

export default new RobotService();
