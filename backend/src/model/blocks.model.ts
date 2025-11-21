import { getDbConnection } from '../database/mssql.database';
import sql from 'mssql';

export interface CreateLearningBlockInput {
	block_name: string;
	block_description: string;
	is_active: boolean;
	created_date?: Date;
	created_by: string;
}

export interface LearningBlockRow {
	id: string;
	block_name: string;
	block_description: string;
	is_active: boolean;
	created_date?: Date;
	created_by: string;
}

export const createLearningBlock = async (
	input: CreateLearningBlockInput
): Promise<LearningBlockRow> => {
	const pool = await getDbConnection();
	const request = pool.request();

	request.input('block_name', sql.NVarChar(100), input.block_name);
	request.input(
		'block_description',
		sql.NVarChar(500),
		input.block_description
	);
	request.input('is_active', sql.Bit, input.is_active);
	request.input('created_date', sql.DateTime2(0), input.created_date);
	request.input('created_by', sql.NVarChar(100), input.created_by);

	const result = await request.query(`
        INSERT INTO [dbo].[LearningBlock] (
            block_name, 
            block_description, 
            is_active, 
            created_date, 
            created_by
        )
        OUTPUT INSERTED.*
        VALUES (
            @block_name, 
            @block_description, 
            @is_active, 
            GETDATE(),
            @created_by
        )
    `);

	// Assuming the INSERTED table contains 'block_id', map it to 'id' if necessary
	return result.recordset[0];
};

export const getLearningBlocks = async (): Promise<LearningBlockRow[]> => {
	const pool = await getDbConnection();
	const result = await pool.request().query(`
        SELECT * FROM [dbo].[LearningBlock]
    `);
	return result.recordset;
};
