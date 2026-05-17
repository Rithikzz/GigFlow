import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Public auth routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Secure private auth routes
router.get('/me', protect, getMe);

export default router;
