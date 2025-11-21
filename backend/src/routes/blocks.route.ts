import { Router } from 'express';
import { createBlockController, getBlocksController } from '../controller/blocks.controller';

const router = Router();

router.get('/', getBlocksController);
router.post('/', createBlockController)

export default router