import { Router } from 'express';
import {
	createQuestionGroupController,
	getQuestionGroupsByBlockIdController,
} from '../controller/question.controller';

const router = Router();

router.get('/:block_id', getQuestionGroupsByBlockIdController);
router.post('/', createQuestionGroupController);

export default router;
