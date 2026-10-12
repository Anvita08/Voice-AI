import Icon from './Icon';
export default function Settings({ language, onLanguageChange }: { language: string; onLanguageChange: (language: string) => void }) {
 return <label className="language-select"><span><Icon name="globe" width="16" height="16"/>Voice language</span><select value={language} onChange={e => { localStorage.setItem('voice-language', e.target.value); onLanguageChange(e.target.value); }}><option value="en-US">English (US)</option><option value="es-ES">Spanish</option><option value="fr-FR">French</option><option value="hi-IN">Hindi</option></select></label>;
}
