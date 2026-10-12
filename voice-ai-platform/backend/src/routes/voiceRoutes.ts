import { Express } from 'express';
import VoiceController from '../controllers/voiceController';
import { openRouterService } from '../services/openRouterService';
export function setRoutes(app: Express) { const controller = new VoiceController(openRouterService); app.post('/api/ai/chat', controller.handleChat.bind(controller)); }
