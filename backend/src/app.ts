import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import * as z from 'zod';
import { getDbConnection } from './database/mssql.database';

(async () => {
	const cnt = await getDbConnection();
	if (!cnt.connected) {
		process.exit(1);
	}

	console.log('Database Connected Success');
})();

const app = express();
app.use(helmet());
app.use(
	cors({
		origin: 'http://localhost:3000',
		credentials: true,
	})
);
app.use(express.json());
app.use(morgan('dev'));
app.use(cookieParser());

app.get('/health', (_req, res) => res.json({ ok: true }));
const apiV1 = express.Router();

// Create API here

app.use('/api/v1', apiV1);

app.use((req: Request, res: Response) => {
	res.status(404).json({ message: 'Sorry, path that you find not exists!!' });
});

app.use((err: unknown, _req: Request, res: Response) => {
	if (err instanceof z.ZodError) {
		const errors = err.issues.map((issue: z.ZodIssue) => {
			const errorObj: {
				path: string;
				code: string;
				message: string;
				expected?: unknown;
			} = {
				path:
					issue.path.length === 1
						? String(issue.path[0])
						: issue.path.join('.'),
				code: issue.code,
				message: issue.message,
			};
			if ('expected' in issue) {
				errorObj.expected = (issue as { expected: unknown }).expected;
			}
			return errorObj;
		});

		res.status(400).json({
			message: 'Validation failed',
			errors,
		});
		return;
	}
	if (err instanceof Error) {
		res.status(500).json({ message: err.message });
	} else {
		res.status(500).json({ message: 'Internal server error' });
	}
});

export default app;
