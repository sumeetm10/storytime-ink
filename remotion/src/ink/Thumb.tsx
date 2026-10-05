import React from 'react';
import { AbsoluteFill, Img, staticFile } from 'remotion';
import { Boil, C, HAND, InkFonts, Moon, Person, Stars, W, H, useInkFont } from './kit';
import { Mound } from './props';

// =============================================================================
// Thumbnail for an ink episode (1920x1080, saved as a 1280x720 jpg): one big
// question in yellow with a heavy ink outline, over a single clear scene - a
// cave woman wide awake on her grass bed under the moon, the fire down to
// embers. Same cast and paper as the episode.
// =============================================================================
const Thumb: React.FC<{ top?: string; bottom?: string; svg?: string }> = ({ top = "COULDN'T", bottom = 'SLEEP?', svg }) => {
  useInkFont();
  return (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <InkFonts />
    <Img src={staticFile('ink/paper.jpg')} style={{ position: 'absolute', width: W, height: H }} />
    <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
      <defs>
        <Boil id="tb" scale={2.5} />
        <linearGradient id="tsky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#141a36" /><stop offset="1" stopColor="#2f3560" /></linearGradient>
        <radialGradient id="temb" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#ff9a3d" stopOpacity={0.55} /><stop offset="1" stopColor="#ff9a3d" stopOpacity={0} /></radialGradient>
      </defs>
      <g filter="url(#tb)">
        <rect x={0} y={0} width={W} height={H} fill="url(#tsky)" />
        <Stars o={1} n={70} seed={3} maxY={700} />
        <Moon x={1680} y={200} r={90} />
        <path d="M 0 800 Q 600 770 1200 790 Q 1600 805 1920 780 L 1920 1080 L 0 1080 Z" fill="#4f4a30" stroke="#2a2320" strokeWidth={5} />
        <circle cx={560} cy={900} r={360} fill="url(#temb)" />
        <Mound x={1300} y={1020} w={820} h={120} seed={9} />
        <Person x={1260} y={1010} s={2.3} skin={C.skin1} tunic={C.ochre} hair="bun" mood="wow" look={-1}
          pose={{ sit: true, la: 30, lb: -60, ra: 30, rb: -60 }} />
        {svg && (
          // the episode's own drawing, big, held up beside her
          <g transform="translate(330 560) scale(1.2)">
            <circle cx={200} cy={200} r={230} fill="#f3ead8" stroke="#2a2320" strokeWidth={8} />
            <g dangerouslySetInnerHTML={{ __html: svg.replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '') }} />
          </g>
        )}
        <path d="M 470 930 L 650 900 M 480 900 L 640 935" stroke="#5a3a22" strokeWidth={16} strokeLinecap="round" />
        {[0, 1, 2].map((i) => <circle key={i} cx={530 + i * 40} cy={905 - (i % 2) * 10} r={10} fill="#ff8a3d" />)}
      </g>
    </svg>
    <div style={{ position: 'absolute', left: 60, top: 70, width: 1000, fontFamily: HAND, fontWeight: 700, lineHeight: 0.95,
      fontSize: 190, color: '#ffd23a', WebkitTextStroke: '14px #1a1410', paintOrder: 'stroke fill',
      textShadow: '0 12px 0 #1a1410' }}>
      {top}<br />{bottom}
    </div>
  </AbsoluteFill>
  );
};

export default Thumb;
