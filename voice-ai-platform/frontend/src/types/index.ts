export interface ChatMessage { role: 'user' | 'assistant'; content: string }
export interface AIResponse { response: string; model?: string; tokens?: number }
