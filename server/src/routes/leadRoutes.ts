import { Router } from 'express';
import { 
  getAllLeads, 
  createLead, 
  updateLead, 
  updateLeadStatus, 
  deleteLead, 
  addLeadNote 
} from '../controllers/leadController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

// Secure all endpoints in leadRoutes
router.use(protect);

router.route('/')
  .get(getAllLeads)
  .post(createLead);

router.route('/:id')
  .put(updateLead)
  .delete(deleteLead);

router.route('/:id/status')
  .patch(updateLeadStatus);

router.route('/:id/notes')
  .post(addLeadNote);

export default router;
