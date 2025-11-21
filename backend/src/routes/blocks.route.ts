import { Router } from 'express';
import { createBlockController } from '../controller/blocks.controller';

const router = Router();

router.post('/', createBlockController)

export default router