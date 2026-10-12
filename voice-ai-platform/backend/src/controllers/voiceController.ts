import { Request, Response } from 'express';
import OpenRouterService, { ServiceError } from '../services/openRouterService';
export default class VoiceController {
 constructor(private service: OpenRouterService) {}
 async handleChat(req: Request, res: Response) {
  const { message, conversationHistory = [] } = req.body || {};
  if (typeof message !== 'string' || !message.trim()) return res.status(400).json({ error: 'Message is required' });
  if (!Array.isArray(conversationHistory) || !conversationHistory.every(item => item && ['user', 'assistant'].includes(item.role) && typeof item.content === 'string'))
   return res.status(400).json({ error: 'Invalid conversation history' });
  try { return res.json(await this.service.generate([{ role: 'system', content: 'You are a helpful voice assistant. Give clear conversational answers.' }, ...conversationHistory, { role: 'user', content: message.trim() }])); }
  catch (error) { return res.status(error instanceof ServiceError ? error.status : 500).json({ error: error instanceof Error ? error.message : 'Request failed' }); }
 }
}
