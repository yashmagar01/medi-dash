import { Router } from 'express';
import { createBill, getBills, getBillById } from '../controllers/billingController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.post('/create', createBill);
router.get('/', getBills);
router.get('/:id', getBillById);

export default router;
