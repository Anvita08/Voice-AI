import express from 'express';
import cors from 'cors';
import env from './config/env';
import { setRoutes } from './routes/voiceRoutes';
import { openRouterService, ServiceError } from './services/openRouterService';
const app = express();
app.use(cors({ origin: process.env.APP_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.get('/api/health', (_req, res) => res.json({ status: 'ok', aiConfigured: Boolean(env.OPENROUTER_API_KEY && env.OPENROUTER_API_KEY !== 'your_openrouter_api_key_here') }));
app.get('/api/health/openrouter', async (_req, res) => {
 try { res.json({ status: 'connected', ...await openRouterService.generate([{ role: 'user', content: 'Say hello in one word' }]) }); }
 catch (error) { res.status(error instanceof ServiceError ? error.status : 500).json({ error: error instanceof Error ? error.message : 'Request failed' }); }
});
setRoutes(app);
app.use((error: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
 res.status(error.type === 'entity.parse.failed' ? 400 : error.status || 500).json({ error: error.type === 'entity.parse.failed' ? 'Invalid JSON request' : 'Unable to process request' });
});
app.listen(env.PORT, '127.0.0.1', () => console.log('Backend running at http://localhost:' + env.PORT)).on('error', error => { console.error(error.message); process.exit(1); });
