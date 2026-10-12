import { useRef, useState } from 'react';
import { sendMessage } from '../services/apiClient';
import { ChatMessage } from '../types';
export default function useVoiceAI() {
 const [conversation, setConversation] = useState<ChatMessage[]>([]);
 const [loading, setLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);
 const pending = useRef(false);
 const sendChatMessage = async (message: string) => {
  if (!message.trim() || pending.current) return false;
  pending.current = true; setLoading(true); setError(null);
  try { const data = await sendMessage(message, conversation); setConversation(prev => [...prev, { role: 'user', content: message }, { role: 'assistant', content: data.response }]); return true; }
  catch (error) { setError(error instanceof Error ? error.message : 'Request failed'); return false; }
  finally { pending.current = false; setLoading(false); }
 };
 const clearConversation = () => { if (!pending.current) { setConversation([]); setError(null); } };
 return { conversation, loading, error, sendChatMessage, clearConversation };
}
