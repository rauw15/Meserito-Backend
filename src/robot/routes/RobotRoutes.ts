// routes/robotRoutes.ts
import { Router } from 'express';
import RobotController from '../controllers/RobotController';

const router = Router();

router.post('/move_forward', RobotController.sendMoveForward);
router.post('/stop', RobotController.sendStop);
router.post('/rotate_left', RobotController.sendRotateLeft);
router.post('/rotate_right', RobotController.sendRotateRight);
router.post('/search_color', RobotController.sendSearchColor);
router.post('/return', RobotController.sendReturn);
router.post('/check_distance', RobotController.sendCheckDistance);

export default router;
