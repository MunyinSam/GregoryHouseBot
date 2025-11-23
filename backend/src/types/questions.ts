export interface QuestionGroupInput {
	block_id: number;
	question_type: string;
	main_question: string;
	normal_answer: string;
	image_url: string;
	created_date?: Date;
}

export interface QuestionGroupRow {
	question_group_id: number;
	block_id: number;
	question_type: string;
	main_question: string;
	normal_answer: string;
	image_url: string;
	created_date: Date;
}
