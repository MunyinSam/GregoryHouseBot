import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { createLearningBlock } from '../model/blocks.model';

const createBlockSchema = z.object({
    block_name: z.string().min(1).max(100),
    block_description: z.string().min(1).max(500),
    is_active: z.boolean(),
    created_date: z.string().datetime(),
});

export const createBlockController = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Validate input
        const parsed = createBlockSchema.parse(req.body);

        // Create block
        const block = await createLearningBlock({
            block_name: parsed.block_name,
            block_description: parsed.block_description,
            is_active: parsed.is_active,
            created_date: new Date(parsed.created_date),
        });

        return res.status(201).json({
            message: 'Block created successfully',
            block,
        });
    } catch (err) {
        next(err);
    }
};