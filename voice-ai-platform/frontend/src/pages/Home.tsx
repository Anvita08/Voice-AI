import { useEffect, useRef, useState } from 'react';
import VoiceRecorder from '../components/VoiceRecorder';
import Settings from '../components/Settings';
import Icon from '../components/Icon';
import useVoiceAI from '../hooks/useVoiceAI';

const suggestions = [
 { title: 'Find a little inspiration', text: 'Give me three creative ideas for a weekend project.', detail: 'Make room for your next big idea', icon: 'spark' as const },
 { title: 'Make the complex simple', text: 'Explain how artificial intelligence works in simple terms.', detail: 'Learn something new, effortlessly', icon: 'globe' as const },
 { title: 'Plan a better day', text: 'Help me plan a productive day with time for breaks.', detail: 'Turn your thoughts into a plan', icon: 'check' as const },
];
export default function Home() {
 const { conversation, loading, error, sendChatMessage, clearConversation } = useVoiceAI();
 const [message, setMessage] = useState('');
 const [language, setLanguage] = useState(localStorage.getItem('voice-language') || 'en-US');
 const [connected, setConnected] = useState<boolean | null>(null);
 const [speaking, setSpeaking] = useState<number | null>(null);
 const bottom = useRef<HTMLDivElement>(null);
 const input = useRef<HTMLTextAreaElement>(null);
 useEffect(() => { let active = true; fetch('/api/health').then(r => { if (!r.ok) throw new Error(); return r.json(); }).then(data => { if (active) setConnected(data.aiConfigured); }).catch(() => { if (active) setConnected(false); }); return () => { active = false; if ('speechSynthesis' in window) speechSynthesis.cancel(); }; }, []);
 useEffect(() => { if (conversation.length) bottom.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }, [conversation, loading]);
 const submit = async () => { if (!message.trim() || loading) return; const sent = message; setMessage(''); if (!await sendChatMessage(sent)) setMessage(sent); };
 const reset = () => { clearConversation(); setMessage(''); if ('speechSynthesis' in window) speechSynthesis.cancel(); setSpeaking(null); input.current?.focus(); };
 const speak = (text: string, index: number) => {
  speechSynthesis.cancel();
  if (speaking === index) { setSpeaking(null); return; }
  const speech = new SpeechSynthesisUtterance(text); speech.lang = language;
  speech.onend = () => setSpeaking(null); speech.onerror = () => setSpeaking(null);
  setSpeaking(index); speechSynthesis.speak(speech);
 };
 return <div className="app-shell">
  <aside className="sidebar">
   <a className="brand" href="/" aria-label="Voice AI home"><span className="brand-mark"><Icon name="mic" /></span>voxa<span className="brand-dot">.</span></a>
   <span className="workspace-label">YOUR WORKSPACE</span>
   <button className="new-chat" onClick={reset} disabled={loading}><Icon name="plus"/>New conversation</button>
   <a className="nav-item active" href="#conversation"><Icon name="chat"/>Voice assistant<span className="nav-indicator"/></a>
   <div className="sidebar-note"><span className="small-spark"><Icon name="spark"/></span><h3>A little less typing.<br/>A little more possibility.</h3><p>Your ideas, in your own voice.</p><div className="mini-wave">{Array.from({ length: 19 }, (_, i) => <i key={i} style={{ height: 8 + ((i * 13) % 27) }}/>)}</div></div>
   <div className="profile"><span className="avatar">Y</span><div><strong>Your workspace</strong><span>Personal assistant</span></div><span className="profile-dot"/></div>
  </aside>
  <div className="main-shell">
   <header className="topbar"><div className="breadcrumb">Workspace<span>/</span><strong>Voice assistant</strong></div><span className={`connection ${connected ? 'online' : ''}`}><i/>{connected === null ? 'Connecting' : connected ? 'AI connected' : 'AI unavailable'}</span></header>
   <main id="conversation">
    <div className="page-heading"><div><span className="eyebrow">A SPACE FOR YOUR THOUGHTS</span><h1>Voice assistant</h1><p>Big questions. Small ideas. Let's talk them through.</p></div><span className="session-tag"><Icon name="spark"/>Your everyday AI</span></div>
    <div className="assistant-layout">
     <section className="conversation-panel" aria-label="Conversation">
      <div className="panel-header"><div><span className="panel-dot"/><strong>Conversation</strong><span className="panel-caption">{conversation.length ? `${conversation.length / 2} exchanges` : 'A fresh start'}</span></div><button className="text-button" onClick={reset} disabled={loading}><Icon name="plus" width="16" height="16"/>New chat</button></div>
      <div className="conversation-body" role="log" aria-live="polite" aria-busy={loading}>
       {!conversation.length && !loading && <div className="welcome"><div className="orb"><div className="orb-inner"><Icon name="spark" width="36" height="36"/></div><span className="orb-ring"/></div><span className="welcome-kicker">READY WHEN YOU ARE</span><h2>What's on your mind?</h2><p>Ask a question, explore an idea, or just start talking.<br/>I'm here to help you find your next step.</p><div className="welcome-tags"><span><Icon name="mic" width="14" height="14"/>Speak naturally</span><span><Icon name="chat" width="14" height="14"/>Think out loud</span></div></div>}
       {conversation.map((item, i) => <article className={`message ${item.role}`} key={i}><span className="message-avatar">{item.role === 'user' ? 'Y' : <Icon name="spark" width="17" height="17"/>}</span><div className="message-content"><strong>{item.role === 'user' ? 'You' : 'Voxa'}<span>{item.role === 'assistant' ? 'AI assistant' : ''}</span></strong><p>{item.content}</p>{item.role === 'assistant' && 'speechSynthesis' in window && <button className="read-button" onClick={() => speak(item.content, i)}><Icon name="volume" width="15" height="15"/>{speaking === i ? 'Stop audio' : 'Listen to response'}</button>}</div></article>)}
       {loading && <div className="thinking"><span className="message-avatar"><Icon name="spark" width="17" height="17"/></span><span>Thinking it through</span><div className="loading-dots"><i/><i/><i/></div></div>}<div ref={bottom}/>
      </div>
      <div className="composer-area">{error && <p className="error-message" role="alert">{error}</p>}<form className="composer" onSubmit={e => { e.preventDefault(); void submit(); }}><label className="sr-only" htmlFor="message">Message your assistant</label><textarea ref={input} id="message" placeholder="Type your thoughts hereâ€¦" value={message} onChange={e => setMessage(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); void submit(); } }} rows={2} disabled={loading}/><div className="composer-bottom"><span><Icon name="chat" width="14" height="14"/>A good conversation starts anywhere</span><button className="send-button" aria-label="Send message" disabled={loading || !message.trim()}><Icon name="arrow" width="18" height="18"/></button></div></form><div className="composer-hint"><span>Enter to send Â· Shift + Enter for a new line</span><span>AI can make mistakes. Check important details.</span></div></div>
     </section>
     <aside className="tools-column"><section className="voice-card"><span className="eyebrow">LET YOUR VOICE LEAD</span><h2>Less typing.<br/>More talking.</h2><p>Say what's on your mind.<br/>We'll take it from there.</p><VoiceRecorder language={language} disabled={loading} onTranscript={text => { setMessage(text); input.current?.focus(); }}/><Settings language={language} onLanguageChange={setLanguage}/></section><section className="tips-card"><span className="tip-icon"><Icon name="spark" width="18" height="18"/></span><h3>Make it your own</h3><p>Give a little context. Tell your assistant what you need and how you'd like it to respond.</p><span className="tip-footer">A little detail goes a long way.</span></section></aside>
    </div>
    <section className="suggestions"><div className="suggestions-heading"><h2>A little inspiration to get started</h2><span>Try a conversation starter</span></div><div className="suggestion-grid">{suggestions.map(s => <button key={s.title} disabled={loading} onClick={() => { setMessage(s.text); input.current?.focus(); }}><span className="suggestion-icon"><Icon name={s.icon}/></span><strong>{s.title}</strong><span>{s.detail}</span><span className="suggestion-arrow">â†—</span></button>)}</div></section>
    <footer className="page-footer"><span><span className="footer-mark">âœ¦</span> Made for the way you think.</span><span>VOICE AI WORKSPACE</span></footer>
   </main>
  </div>
 </div>;
}

