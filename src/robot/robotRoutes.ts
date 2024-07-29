// src/robot/routes.ts
import { Router } from 'express';
import { moveToTableColor, deliverOrderToTable} from './commands';

const router = Router();

router.post('/move-to-color', moveToTableColor);
router.post('/deliver-order', deliverOrderToTable);

export default router;
