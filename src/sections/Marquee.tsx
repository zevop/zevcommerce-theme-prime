'use client';

interface MarqueeProps {
  settings: {
    text: string;
    speed: number;
    direction: 'left' | 'right';
    background_color: string;
    text_color: string;
    pause_on_hover: boolean;
    upper_case: boolean;
    font_size: 'small' | 'medium' | 'large' | 'jumbo';
  };
}

export default function Marquee({ settings }: MarqueeProps) {
  const {
    text = 'Welcome to our store',
    speed = 20, // seconds
    direction = 'left',
    background_color = '#000000',
    text_color = '#ffffff',
    pause_on_hover = true,
    upper_case = true,
    font_size = 'medium'
  } = settings;

  const animationName = direction === 'left' ? 'marquee-left' : 'marquee-right';

  // Font Size Classes
  let fontSizeClass = 'text-xl py-3';
  if (font_size === 'small') fontSizeClass = 'text-sm py-2 font-medium';
  if (font_size === 'large') fontSizeClass = 'text-4xl py-6 font-bold';
  if (font_size === 'jumbo') fontSizeClass = 'text-8xl py-10 font-black tracking-tighter';

  const textStyle = {
    color: text_color
  }

  // We repeat the text enough times to fill the potential screen width and crate a seamless loop
  // For a truly robust marquee we'd need JS to measure width, but for now we can just repeat a fixed reasonable amount
  // or use a "ticker" style with two identical tracks

  return (
    <section
      className="w-full overflow-hidden flex whitespace-nowrap"
      style={{ backgroundColor: background_color }}
    >
      <style dangerouslySetInnerHTML={{
        __html: `
            @keyframes marquee-left {
                0% { transform: translateX(0); }
                100% { transform: translateX(-100%); }
            }
            @keyframes marquee-right {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(0); }
            }
            .animate-marquee {
                animation: ${direction === 'left' ? 'marquee-left' : 'marquee-right'} ${speed}s linear infinite;
            }
            .group:hover .animate-marquee {
                animation-play-state: ${pause_on_hover ? 'paused' : 'running'};
            }
        `}} />

      <div className={`group w-full flex overflow-hidden`}>
        {/* Track 1 */}
        <div className={`animate-marquee flex shrink-0 min-w-full items-center justify-around gap-8 px-4 ${pause_on_hover ? 'hover:pause' : ''}`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i} className={`${fontSizeClass} ${upper_case ? 'uppercase' : ''}`} style={textStyle}>
              {text}
            </span>
          ))}
        </div>
        {/* Track 2 (Duplicate for seamless loop) - only needed if we want loop, but the CSS translate moves the ENTIRE block. 
                Standard marquee technique: two identical children translating. 
             */}
        <div className={`animate-marquee flex shrink-0 min-w-full items-center justify-around gap-8 px-4 ${pause_on_hover ? 'hover:pause' : ''}`}>
          {Array.from({ length: 10 }).map((_, i) => (
            <span key={i + 10} className={`${fontSizeClass} ${upper_case ? 'uppercase' : ''}`} style={textStyle}>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export const schema = {
  type: 'marquee',
  name: 'Marquee',
  settings: [
    {
      type: 'text',
      id: 'text',
      label: 'Text',
      default: 'Free shipping on all orders over $100'
    },
    {
      type: 'select',
      id: 'font_size',
      label: 'Font Size',
      options: [
        { value: 'small', label: 'Small' },
        { value: 'medium', label: 'Medium' },
        { value: 'large', label: 'Large' },
        { value: 'jumbo', label: 'Jumbo' }
      ],
      default: 'medium'
    },
    {
      type: 'range',
      id: 'speed',
      label: 'Animation Duration (s)',
      min: 5,
      max: 60,
      step: 1,
      default: 20,
      info: 'Lower is faster'
    },
    {
      type: 'select',
      id: 'direction',
      label: 'Direction',
      options: [
        { value: 'left', label: 'Right to Left' },
        { value: 'right', label: 'Left to Right' }
      ],
      default: 'left'
    },
    {
      type: 'checkbox',
      id: 'upper_case',
      label: 'Uppercase Text',
      default: true
    },
    {
      type: 'checkbox',
      id: 'pause_on_hover',
      label: 'Pause on hover',
      default: true
    },
    {
      type: 'color',
      id: 'background_color',
      label: 'Background Color',
      default: '#000000'
    },
    {
      type: 'color',
      id: 'text_color',
      label: 'Text Color',
      default: '#ffffff'
    }
  ]
};
