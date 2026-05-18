import { Router } from 'express';
import { registerUser, loginUser, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { validateLogin, validateRegister } from '../validators/index.js';

const router = Router();

// Public auth routes
router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);

// Secure private auth routes
router.get('/me', protect, getMe);

export default router;
