import { useEffect, useRef, useState } from 'react';
import Icon from './Icon';
interface Recognition {
 lang: string; continuous: boolean; interimResults: boolean;
 onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
 onerror: ((event: { error: string }) => void) | null;
 onend: (() => void) | null; start(): void; stop(): void; abort(): void;
}
type VoiceWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };
export default function VoiceRecorder({ language, onTranscript, disabled = false }: { language: string; onTranscript: (text: string) => void; disabled?: boolean }) {
 const [recording, setRecording] = useState(false); const [error, setError] = useState('');
 const recognition = useRef<Recognition | null>(null);
 const browser = window as VoiceWindow;
 const Constructor = browser.SpeechRecognition || browser.webkitSpeechRecognition;
 useEffect(() => () => { if (recognition.current) { recognition.current.onend = null; recognition.current.onerror = null; recognition.current.onresult = null; recognition.current.abort(); } }, []);
 const start = () => {
  if (!Constructor) return;
  setError(''); const instance = new Constructor();
  instance.lang = language; instance.continuous = false; instance.interimResults = false;
  instance.onresult = event => onTranscript(event.results[0][0].transcript);
  instance.onerror = event => { setError('Microphone: ' + event.error + '. You can type below.'); setRecording(false); };
  instance.onend = () => setRecording(false); recognition.current = instance;
  try { instance.start(); setRecording(true); } catch { setError('Unable to start microphone. Please try again.'); }
 };
 return <div className={`voice-control ${recording ? 'is-recording' : ''}`}>
 <div className="voice-wave" aria-hidden="true">{Array.from({ length: 23 }, (_, i) => <i key={i} style={{ height: 8 + ((i * 17) % 35), animationDelay: `${i * .07}s` }}/>)}</div>
 <button className="mic-button" type="button" aria-label={recording ? 'Stop listening' : 'Start listening'} aria-pressed={recording} disabled={!Constructor || disabled} onClick={() => recording ? recognition.current?.stop() : start()}><Icon name="mic" width="27" height="27"/></button>
 <strong className="voice-state">{recording ? 'Listening to you…' : 'Tap to start talking'}</strong>
 <span className="voice-description">{recording ? 'Tap again to stop' : Constructor ? 'Your words become your message' : 'Use Chrome or Edge for voice input'}</span>
 {error && <p className="error-message" role="alert">{error}</p>}</div>;
}
