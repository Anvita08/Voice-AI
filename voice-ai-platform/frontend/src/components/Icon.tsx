import { SVGProps } from 'react';
type Name = 'mic' | 'arrow' | 'plus' | 'spark' | 'chat' | 'volume' | 'check' | 'globe';
const paths: Record<Name, React.ReactNode> = {
 mic: <><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10v2a7 7 0 0 0 14 0v-2M12 19v3M8 22h8"/></>,
 arrow: <><path d="M12 19V5M5 12l7-7 7 7"/></>,
 plus: <path d="M12 5v14M5 12h14"/>,
 spark: <><path d="m12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3Z"/></>,
 chat: <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2V11.5a9.5 9.5 0 0 1 19 0Z"/>,
 volume: <><path d="m11 5-6 4H2v6h3l6 4V5ZM15 8a6 6 0 0 1 0 8M18 5a10 10 0 0 1 0 14"/></>,
 check: <path d="m5 12 4 4L19 6"/>,
 globe: <><circle cx="12" cy="12" r="9"/><ellipse cx="12" cy="12" rx="4" ry="9"/><path d="M3 12h18"/></>
};
export default function Icon({ name, ...props }: SVGProps<SVGSVGElement> & { name: Name }) {
 return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>{paths[name]}</svg>;
}
