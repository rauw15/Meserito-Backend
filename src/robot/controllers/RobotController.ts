// controllers/RobotController.ts
import { Request, Response } from 'express';
import RobotService from '../services/RobotService';

class RobotController {
  static async sendMoveForward(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'move_forward', value: 70 });
      res.status(200).json({ message: 'Move Forward command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Move Forward command', error });
    }
  }

  static async sendStop(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'stop' });
      res.status(200).json({ message: 'Stop command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Stop command', error });
    }
  }

  static async sendRotateLeft(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'rotate_left', value: 80 });
      res.status(200).json({ message: 'Rotate Left command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Rotate Left command', error });
    }
  }

  static async sendRotateRight(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'rotate_right', value: 80 });
      res.status(200).json({ message: 'Rotate Right command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Rotate Right command', error });
    }
  }

  static async sendSearchColor(req: Request, res: Response) {
    const { color } = req.body;
    try {
      await RobotService.sendCommand({ action: 'search_color', value: color });
      res.status(200).json({ message: 'Search Color command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Search Color command', error });
    }
  }

  static async sendReturn(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'return' });
      res.status(200).json({ message: 'Return command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Return command', error });
    }
  }

  static async sendCheckDistance(req: Request, res: Response) {
    try {
      await RobotService.sendCommand({ action: 'check_distance' });
      res.status(200).json({ message: 'Check Distance command sent successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error sending Check Distance command', error });
    }
  }
}

export default RobotController;
