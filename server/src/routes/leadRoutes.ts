import { Router } from 'express';
import { 
  getAllLeads, 
  getLeadById,
  createLead, 
  updateLead, 
  deleteLead
} from '../controllers/leadController.js';
import { authorizeRoles, protect } from '../middleware/authMiddleware.js';
import { validateCreateLead, validateLeadQuery, validateUpdateLead } from '../validators/index.js';

const router = Router();

// Secure all endpoints in leadRoutes
router.use(protect);

router.route('/')
  .get(validateLeadQuery, getAllLeads)
  .post(validateCreateLead, createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validateUpdateLead, updateLead)
  .delete(authorizeRoles('ADMIN'), deleteLead);

export default router;
