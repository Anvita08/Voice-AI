import axios from 'axios';
import env from '../config/env';
export interface ChatMessage { role: 'system' | 'user' | 'assistant'; content: string }
export class ServiceError extends Error { constructor(message: string, public status = 502) { super(message); } }
export default class OpenRouterService {
 async generate(messages: ChatMessage[]) {
  if (!env.OPENROUTER_API_KEY || env.OPENROUTER_API_KEY === 'your_openrouter_api_key_here') throw new ServiceError('Set OPENROUTER_API_KEY in backend/.env to enable AI replies.', 503);
  try {
   const { data } = await axios.post('https://openrouter.ai/api/v1/chat/completions', { model: env.OPENROUTER_MODEL, messages }, { headers: { Authorization: 'Bearer ' + env.OPENROUTER_API_KEY }, timeout: 60000 });
   const text = data.choices?.[0]?.message?.content;
   if (typeof text !== 'string' || !text.trim()) throw new ServiceError('OpenRouter returned no text.');
   return { response: text, model: data.model, tokens: data.usage?.total_tokens };
  } catch (error) {
   if (error instanceof ServiceError) throw error;
   throw new ServiceError(axios.isAxiosError(error) ? error.response?.data?.error?.message || 'Unable to reach OpenRouter. Check your key, model and connection.' : 'AI request failed.');
  }
 }
}
export const openRouterService = new OpenRouterService();
