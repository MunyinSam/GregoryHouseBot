import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
	createQuestionGroup,
	getQuestionGroupsByBlockId,
} from '../model/questions.model';

const createQuestionGroupSchema = z.object({
	block_id: z.number(),
	question_type: z.string().min(1).max(20),
	main_question: z.string().min(1),
	normal_answer: z.string().min(1),
	image_url: z.string().max(500).optional(),
	created_date: z.string().datetime().optional(),
});

export const createQuestionGroupController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const parsed = createQuestionGroupSchema.parse(req.body);

		const questionGroup = await createQuestionGroup({
			block_id: parsed.block_id,
			question_type: parsed.question_type,
			main_question: parsed.main_question,
			normal_answer: parsed.normal_answer,
			image_url: parsed.image_url ?? '',
			created_date: parsed.created_date
				? new Date(parsed.created_date)
				: new Date(),
		});

		return res.status(201).json({
			message: 'Question group created successfully',
			questionGroup,
		});
	} catch (err) {
		next(err);
	}
};

export const getQuestionGroupsByBlockIdController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const block_id = Number(req.params.block_id);
		if (isNaN(block_id)) {
			return res.status(400).json({ message: 'Invalid block_id' });
		}
		const questionGroups = await getQuestionGroupsByBlockId(block_id);
		return res.status(200).json({ questionGroups });
	} catch (err) {
		next(err);
	}
};
