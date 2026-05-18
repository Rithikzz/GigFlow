import { Router } from 'express';
import authRoutes from './authRoutes.js';
import leadRoutes from './leadRoutes.js';
import { healthCheck } from '../controllers/healthController.js';

const router = Router();

router.get('/health', healthCheck);

router.use('/auth', authRoutes);
router.use('/leads', leadRoutes);

export default router;
