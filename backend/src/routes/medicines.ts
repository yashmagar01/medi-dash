import { Router } from 'express';
import {
  getMedicines,
  createMedicine,
  updateMedicine,
  deleteMedicine,
} from '../controllers/medicinesController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);

router.get('/', getMedicines);
router.post('/', createMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

export default router;
