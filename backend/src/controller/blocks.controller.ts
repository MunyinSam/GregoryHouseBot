import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createLearningBlock, getLearningBlocks } from '../model/blocks.model';

const createBlockSchema = z.object({
	block_name: z.string().min(1).max(100),
	block_description: z.string().min(1).max(500),
	is_active: z.boolean(),
	created_by: z.string().min(1).max(100),
});

export const createBlockController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const parsed = createBlockSchema.parse(req.body);

		const block = await createLearningBlock({
			block_name: parsed.block_name,
			block_description: parsed.block_description,
			is_active: parsed.is_active,
			created_by: parsed.created_by,
		});

		return res.status(201).json({
			message: 'Block created successfully',
			block,
		});
	} catch (err) {
		next(err);
	}
};

export const getBlocksController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const blocks = await getLearningBlocks();
		return res.status(200).json({ blocks });
	} catch (err) {
		next(err);
	}
};
