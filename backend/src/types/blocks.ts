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