import { AIResponse, ChatMessage } from '../types';
export async function sendMessage(message: string, conversationHistory: ChatMessage[] = []): Promise<AIResponse> {
 const response = await fetch('/api/ai/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message, conversationHistory }) });
 const data = await response.json();
 if (!response.ok) throw new Error(data.error || 'Failed to send message');
 return data;
}
export const sendChatMessage = sendMessage;
