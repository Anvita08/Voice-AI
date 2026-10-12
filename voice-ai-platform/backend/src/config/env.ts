import { config } from 'dotenv';
import path from 'node:path';
config({ path: path.resolve(__dirname, '../../.env') });
export default { PORT: Number(process.env.PORT || 3000), OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '', OPENROUTER_MODEL: process.env.OPENROUTER_MODEL || 'openrouter/auto' };
