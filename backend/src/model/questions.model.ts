import { getDbConnection } from '../database/mssql.database';
import sql from 'mssql';
import * as t from '../types/questions';

export const createQuestionGroup = async (
	input: t.QuestionGroupInput
): Promise<t.QuestionGroupRow> => {
	const pool = await getDbConnection();
	const request = pool.request();

	request.input('block_id', sql.Int, input.block_id);
	request.input('question_type', sql.VarChar(20), input.question_type);
	request.input('main_question', sql.NVarChar(sql.MAX), input.main_question);
	request.input('normal_answer', sql.NVarChar(sql.MAX), input.normal_answer);
	request.input('image_url', sql.VarChar(500), input.image_url);
	request.input(
		'created_date',
		sql.DateTime2(0),
		input.created_date ?? new Date()
	);

	const result = await request.query(`
        INSERT INTO [dbo].[QuestionGroup]
            ([block_id], [question_type], [main_question], [normal_answer], [image_url], [created_date])
        OUTPUT INSERTED.*
        VALUES
            (@block_id, @question_type, @main_question, @normal_answer, @image_url, @created_date)
    `);

	return result.recordset[0];
};

export const getQuestionGroupsByBlockId = async (
	block_id: number
): Promise<t.QuestionGroupRow[]> => {
	const pool = await getDbConnection();
	const result = await pool.request().input('block_id', sql.Int, block_id)
		.query(`
            SELECT * FROM [dbo].[QuestionGroup]
            WHERE block_id = @block_id
        `);
	return result.recordset;
};
