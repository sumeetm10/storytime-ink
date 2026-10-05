import React, { useEffect, useState } from 'react';
import { continueRender, delayRender, staticFile, useCurrentFrame } from 'remotion';

// =============================================================================
// Ink kit - the Story_time10 look, drawn in code: dark-brown ink lines that
// "boil" (redrawn with a slight wobble every 4 frames, like hand-drawn
// animation), colour fills printed slightly off the line (risograph style) on
// cream paper, and our own cast: egg heads, big expressive eyes and brows,
// outlined noodle limbs, fur tunics. Everything is parametric so one rig
// covers every pose and mood.
// =============================================================================
export const W = 1920;
export const H = 1080;
export const INK = '#2a2320';
export const C = {
  paper: '#f3ead8', ochre: '#d9a14e', rust: '#b9553a', sage: '#93a878', sky: '#a9c4cf', dusk: '#eaa77c',
  night: '#262c48', grass: '#bcb36a', hair: '#3a2a20', skin1: '#8a5a3c', skin2: '#a8714c', skin3: '#6f4630',
  fire: '#ff9a3d', ember: '#ffcf6a', leaf: '#6f9a52', rock: '#8c7a68', red: '#c8382c',
};
export const HAND = "'InkHand', 'Comic Sans MS', cursive";

// the hand-lettering font: Patrick Hand (SIL Open Font License, public/ink/hand.woff2, see hand-LICENSE.txt).
// Each composition calls useInkFont() so no frame renders before the font is ready.
export const InkFonts: React.FC = () => (
  <style>{`@font-face { font-family: 'InkHand'; src: url('${staticFile('ink/hand.woff2')}') format('woff2'); font-display: block; }`}</style>
);
export const useInkFont = () => {
  const [handle] = useState(() => delayRender('ink font', { timeoutInMilliseconds: 60000 }));
  useEffect(() => {
    let done = false;
    const finish = () => { if (!done) { done = true; continueRender(handle); } };
    const face = new FontFace('InkHand', `url('${staticFile('ink/hand.woff2')}') format('woff2')`);
    face.load().then((f) => { document.fonts.add(f); finish(); }).catch(finish);
    const t = setTimeout(finish, 20000);
    return () => clearTimeout(t);
  }, [handle]);
};

export const clamp = (t: number) => Math.max(0, Math.min(1, t));
export const prog = (f: number, a: number, b: number) => clamp((f - a) / Math.max(1, b - a));
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

// line boil: one shared displacement filter whose noise changes every 4 frames
export const Boil: React.FC<{ id: string; scale?: number }> = ({ id, scale = 3.4 }) => {
  const f = useCurrentFrame();
  return (
    <filter id={id} x="-3%" y="-3%" width="106%" height="106%">
      <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves={2} seed={(Math.floor(f / 4) % 6) + 1} result="n" />
      <feDisplacementMap in="SourceGraphic" in2="n" scale={scale} xChannelSelector="R" yChannelSelector="G" />
    </filter>
  );
};

// a filled shape: the colour printed a little off the ink line
export const Shape: React.FC<{ d: string; fill?: string; sw?: number; o?: number; ink?: string }> = ({ d, fill, sw = 5, o = 1, ink = INK }) => (
  <g opacity={o}>
    {fill && <path d={d} fill={fill} transform="translate(4 3)" />}
    <path d={d} fill="none" stroke={ink} strokeWidth={sw} strokeLinejoin="round" strokeLinecap="round" />
  </g>
);

export type Mood = 'neutral' | 'worried' | 'happy' | 'sleepy' | 'wow' | 'scared';
export type Pose = { la?: number; ra?: number; lb?: number; rb?: number; ll?: number; rl?: number; sit?: boolean };
type Hair = 'shaggy' | 'bun' | 'kid' | 'beard' | 'short' | 'bald';
export type Outfit = 'fur' | 'shirt' | 'coat' | 'gown';

const limb = (x: number, y: number, dir: number, a: number, b: number, len: number) => {
  const r = Math.PI / 180;
  const ex = x + dir * len * Math.sin(a * r); const ey = y + len * Math.cos(a * r);
  const hx = ex + dir * len * Math.sin((a + b) * r); const hy = ey + len * Math.cos((a + b) * r);
  return { d: `M ${x} ${y} L ${ex} ${ey} L ${hx} ${hy}`, hx, hy };
};

const Limb: React.FC<{ d: string; skin: string; w?: number }> = ({ d, skin, w = 9 }) => (
  <g fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} stroke={INK} strokeWidth={w + 9} />
    <path d={d} stroke={skin} strokeWidth={w} />
  </g>
);

const Face: React.FC<{ mood: Mood; blink: boolean; look: number; skin: string }> = ({ mood, blink, look, skin }) => {
  const ey = -284;
  const brow = {
    neutral: [[-28, -302, -8, -304], [8, -304, 28, -302]], happy: [[-28, -300, -8, -306], [8, -306, 28, -300]],
    worried: [[-28, -302, -8, -310], [8, -310, 28, -302]], scared: [[-28, -304, -8, -314], [8, -314, 28, -304]],
    wow: [[-28, -312, -8, -316], [8, -316, 28, -312]], sleepy: [[-28, -300, -8, -300], [8, -300, 28, -300]],
  }[mood];
  const mouth = {
    neutral: 'M -8 -252 L 8 -252', happy: 'M -14 -256 Q 0 -242 14 -256', worried: 'M -10 -248 Q 0 -256 10 -248',
    scared: 'M -12 -250 Q -6 -256 0 -250 Q 6 -244 12 -250', wow: '', sleepy: 'M -6 -252 L 6 -252',
  }[mood];
  const lid = mood === 'sleepy' ? 0.55 : 0;
  return (
    <g>
      {[-17, 17].map((ex) => (
        <g key={ex}>
          {blink ? <path d={`M ${ex - 9} ${ey} Q ${ex} ${ey + 4} ${ex + 9} ${ey}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
            : (
              <>
                <ellipse cx={ex} cy={ey} rx={10} ry={mood === 'wow' || mood === 'scared' ? 13 : 11} fill="#fffaf0" stroke={INK} strokeWidth={3} />
                <circle cx={ex + look * 4} cy={ey + 1} r={5.2} fill={INK} />
                <circle cx={ex + look * 4 + 1.8} cy={ey - 1.6} r={1.6} fill="#fffaf0" />
                {lid > 0 && <path d={`M ${ex - 11} ${ey - 12} L ${ex + 11} ${ey - 12} L ${ex + 11} ${ey + 1} L ${ex - 11} ${ey + 1} Z`} fill={skin} stroke={INK} strokeWidth={3} />}
              </>
            )}
        </g>
      ))}
      {brow.map(([x1, y1, x2, y2], i) => <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={INK} strokeWidth={5} strokeLinecap="round" />)}
      <path d="M 2 -272 Q 9 -266 2 -262" stroke={INK} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      {mood === 'wow' ? <ellipse cx={0} cy={-250} rx={7} ry={9} fill={INK} />
        : <path d={mouth} stroke={INK} strokeWidth={4.5} fill="none" strokeLinecap="round" />}
    </g>
  );
};

const HairShape: React.FC<{ hair: Hair; color?: string }> = ({ hair, color }) => {
  const h = color ?? C.hair;
  if (hair === 'bald') return <Shape d="M -48 -282 Q -52 -300 -44 -306 L -40 -290 Z M 48 -282 Q 52 -300 44 -306 L 40 -290 Z" fill={h} />;
  if (hair === 'short') return <Shape d="M -48 -290 Q -52 -340 0 -340 Q 52 -340 48 -290 Q 40 -318 10 -318 Q -10 -328 -26 -316 Q -42 -310 -48 -290 Z" fill={h} />;
  if (hair === 'bun') return (
    <g>
      <Shape d="M -46 -294 Q -50 -338 0 -338 Q 50 -338 46 -294 Q 30 -322 0 -320 Q -30 -322 -46 -294 Z" fill={h} />
      <Shape d="M -18 -346 A 20 18 0 1 1 18 -346 A 20 18 0 1 1 -18 -346 Z" fill={h} />
    </g>
  );
  if (hair === 'kid') return <Shape d="M -36 -306 Q -30 -340 4 -336 Q 34 -334 40 -304 Q 20 -320 8 -318 Q 4 -330 -8 -318 Q -24 -322 -36 -306 Z" fill={h} />;
  return (
    <g>
      <Shape d="M -52 -282 Q -64 -326 -40 -340 Q -30 -360 -4 -350 Q 16 -366 36 -348 Q 62 -344 54 -300 Q 58 -286 50 -280
        Q 42 -312 20 -318 Q 0 -326 -22 -316 Q -44 -308 -52 -282 Z" fill={h} />
      {hair === 'beard' && <Shape d="M -44 -268 Q -46 -228 -20 -214 Q 0 -206 20 -214 Q 46 -228 44 -268 Q 30 -244 0 -242 Q -30 -244 -44 -268 Z" fill={h} />}
    </g>
  );
};

export const Person: React.FC<{
  x: number; y: number; s?: number; skin?: string; tunic?: string; hair?: Hair; mood?: Mood; pose?: Pose;
  blink?: boolean; look?: number; flip?: boolean; carry?: React.ReactNode;
  outfit?: Outfit; hairColor?: string; glasses?: boolean; brow?: boolean; hand?: React.ReactNode;
}> = ({ x, y, s = 1, skin = C.skin2, tunic = C.ochre, hair = 'shaggy', mood = 'neutral', pose = {}, blink = false, look = 0, flip = false, carry,
  outfit = 'fur', hairColor, glasses = false, brow = false, hand }) => {
  const { la = 12, ra = 12, lb = 0, rb = 0, ll = 6, rl = 6, sit = false } = pose;
  const hipY = sit ? -64 : -120;
  const shY = hipY - 92;
  const legs = sit
    ? [`M -14 ${hipY} L 52 ${hipY + 4} L 56 0`, `M 14 ${hipY} L 74 ${hipY + 4} L 80 0`]
    : [limb(-14, hipY, -1, ll, 0, 62).d, limb(14, hipY, 1, rl, 0, 62).d];
  const L = limb(-30, shY + 8, -1, la, lb, 52);
  const R = limb(30, shY + 8, 1, ra, rb, 52);
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      {legs.map((d, i) => <Limb key={i} d={d} skin={skin} w={11} />)}
      <Limb d={L.d} skin={skin} />
      {outfit === 'fur' ? (
        <>
          {/* fur tunic with a ragged hem */}
          <Shape d={`M -34 ${shY + 2} Q 0 ${shY - 10} 34 ${shY + 2} L 46 ${hipY + 14} L 32 ${hipY + 4} L 22 ${hipY + 16} L 8 ${hipY + 6}
            L -6 ${hipY + 18} L -20 ${hipY + 6} L -32 ${hipY + 16} L -46 ${hipY + 12} Z`} fill={tunic} />
          <path d={`M -20 ${shY + 18} l 6 8 M 4 ${shY + 30} l 6 8 M -12 ${hipY - 30} l 6 8 M 16 ${hipY - 44} l 6 8`} stroke={INK}
            strokeWidth={3} opacity={0.5} />
        </>
      ) : outfit === 'coat' ? (
        <>
          <Shape d={`M -36 ${shY + 2} Q 0 ${shY - 10} 36 ${shY + 2} L 48 ${hipY + 40} L -48 ${hipY + 40} Z`} fill="#f4f1ea" />
          <path d={`M 0 ${shY} L 0 ${hipY + 40} M -14 ${shY + 2} L 0 ${shY + 30} L 14 ${shY + 2}`} stroke={INK} strokeWidth={3.5} fill="none" />
          <rect x={14} y={shY + 30} width={16} height={12} fill="none" stroke={INK} strokeWidth={3} />
        </>
      ) : outfit === 'gown' ? (
        <>
          <Shape d={`M -34 ${shY + 2} Q 0 ${shY - 10} 34 ${shY + 2} L 52 ${hipY + 60} L -52 ${hipY + 60} Z`} fill={tunic} />
          <path d={`M -30 ${shY + 6} Q 0 ${shY + 26} 30 ${shY + 6}`} stroke="#fbf4e4" strokeWidth={8} fill="none" />
        </>
      ) : (
        <>
          <Shape d={`M -34 ${shY + 2} Q 0 ${shY - 10} 34 ${shY + 2} L 40 ${hipY + 8} L -40 ${hipY + 8} Z`} fill={tunic} />
          <path d={`M -12 ${shY - 2} L 0 ${shY + 14} L 12 ${shY - 2}`} stroke={INK} strokeWidth={3.5} fill="none" />
        </>
      )}
      <Limb d={R.d} skin={skin} />
      {carry && <g transform={`translate(${(L.hx + R.hx) / 2} ${(L.hy + R.hy) / 2})`}>{carry}</g>}
      {hand && <g transform={`translate(${R.hx} ${R.hy})`}>{hand}</g>}
      <rect x={-9} y={shY - 22} width={18} height={26} fill={skin} />
      {/* the head is drawn for a standing body; a seated one moves it down onto the shoulders */}
      <g transform={`translate(0 ${shY + 212})`}>
        <ellipse cx={-47} cy={-280} rx={8} ry={11} fill={skin} stroke={INK} strokeWidth={4} />
        <ellipse cx={47} cy={-280} rx={8} ry={11} fill={skin} stroke={INK} strokeWidth={4} />
        <Shape d="M 0 -336 C 34 -336 50 -310 48 -280 C 46 -244 26 -222 0 -222 C -26 -222 -46 -244 -48 -280 C -50 -310 -34 -336 0 -336 Z" fill={skin} />
        <HairShape hair={hair} color={hairColor} />
        <Face mood={mood} blink={blink} look={look} skin={skin} />
        {brow && <path d="M -36 -298 Q -18 -312 0 -302 Q 18 -312 36 -298" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />}
        {glasses && <g fill="none" stroke={INK} strokeWidth={4}><circle cx={-17} cy={-284} r={15} /><circle cx={17} cy={-284} r={15} />
          <line x1={-2} y1={-286} x2={2} y2={-286} /></g>}
      </g>
    </g>
  );
};

export const Fire: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 1 }) => {
  const f = useCurrentFrame();
  const tongue = (w: number, h: number, ph: number) => {
    const sway = Math.sin(f / 5 + ph) * 8; const hh = h * (0.9 + 0.12 * Math.sin(f / 3.3 + ph * 2));
    return `M ${-w} 0 Q ${-w * 0.9} ${-hh * 0.5} ${sway} ${-hh} Q ${w * 0.9} ${-hh * 0.5} ${w} 0 Z`;
  };
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shape d="M -70 6 L 60 -14 M -60 -14 L 70 6" sw={16} ink="#5a3a22" />
      <path d="M -70 6 L 60 -14 M -60 -14 L 70 6" stroke={INK} strokeWidth={4} opacity={0.4} />
      {t > 0.01 && (
        <g transform={`scale(${t})`}>
          <Shape d={tongue(52, 150, 0)} fill={C.fire} sw={4.5} />
          <Shape d={tongue(32, 110, 2)} fill={C.ember} sw={3.5} />
          <path d={tongue(14, 60, 4)} fill="#fff5d0" />
          {[0, 1, 2].map((i) => {
            const k = ((f * 1.5 + i * 23) % 60) / 60;
            return <circle key={i} cx={Math.sin(f / 7 + i * 2) * 26} cy={-120 - k * 120} r={3.5 * (1 - k)} fill={C.ember} />;
          })}
        </g>
      )}
    </g>
  );
};

export const Glow: React.FC<{ x: number; y: number; r: number; o: number; id: string; color?: string }> = ({ x, y, r, o, id, color = '#ffb35c' }) => (
  <g opacity={o}>
    <defs>
      <radialGradient id={id} cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor={color} stopOpacity={0.55} /><stop offset="0.5" stopColor={color} stopOpacity={0.18} />
        <stop offset="1" stopColor={color} stopOpacity={0} />
      </radialGradient>
    </defs>
    <circle cx={x} cy={y} r={r} fill={`url(#${id})`} />
  </g>
);

export const Tuft: React.FC<{ x: number; y: number; s?: number; i?: number; color?: string }> = ({ x, y, s = 1, i = 0, color = '#8f8a46' }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 22 + i) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round">
      {[-16, -6, 4, 14].map((dx, k) => (
        <path key={k} d={`M ${dx} 0 Q ${dx + sw * 0.5} -30 ${dx + sw + (k - 1.5) * 8} ${-48 - (k % 2) * 16}`} stroke={color} strokeWidth={7} />
      ))}
      {[-16, -6, 4, 14].map((dx, k) => (
        <path key={`o${k}`} d={`M ${dx} 0 Q ${dx + sw * 0.5} -30 ${dx + sw + (k - 1.5) * 8} ${-48 - (k % 2) * 16}`} strokeWidth={2.5} />
      ))}
    </g>
  );
};

export const Acacia: React.FC<{ x: number; y: number; s?: number; fill?: string }> = ({ x, y, s = 1, fill = '#6f8a55' }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -10 0 L -6 -150 L -60 -230 M -6 -150 L 40 -240 M -6 -170 L -10 -250" sw={12} ink="#4a3526" />
    <Shape d="M -190 -250 Q -170 -300 -90 -296 Q -40 -330 30 -310 Q 120 -330 170 -292 Q 220 -270 160 -248 Q 60 -232 -40 -240 Q -140 -228 -190 -250 Z" fill={fill} />
  </g>
);

export const Stars: React.FC<{ o: number; n?: number; seed?: number; maxY?: number }> = ({ o, n = 70, seed = 5, maxY = 600 }) => {
  const f = useCurrentFrame();
  const r = rng(seed);
  return (
    <g opacity={o}>
      {Array.from({ length: n }, (_, i) => {
        const x = r() * W; const y = r() * maxY; const s = 2 + r() * 5; const tw = 0.6 + 0.4 * Math.sin(f / 8 + i);
        return <path key={i} d={`M ${x} ${y - s} L ${x + s * 0.3} ${y - s * 0.3} L ${x + s} ${y} L ${x + s * 0.3} ${y + s * 0.3} L ${x} ${y + s}
          L ${x - s * 0.3} ${y + s * 0.3} L ${x - s} ${y} L ${x - s * 0.3} ${y - s * 0.3} Z`} fill="#fff6dc" opacity={tw} />;
      })}
    </g>
  );
};

export const Moon: React.FC<{ x: number; y: number; r: number; o?: number }> = ({ x, y, r, o = 1 }) => (
  <g opacity={o}>
    <Shape d={`M ${x} ${y - r} A ${r} ${r} 0 1 0 ${x} ${y + r} A ${r * 0.72} ${r} 0 1 1 ${x} ${y - r} Z`} fill="#f6e7b8" />
  </g>
);

// a hand-lettered label on a scrap of paper
export const Tag: React.FC<{ x: number; y: number; text: string; o: number; rot?: number; size?: number; color?: string; fill?: string }> = ({
  x, y, text, o, rot = -3, size = 44, color = INK, fill = '#fbf4e4' }) => {
  const w = text.length * size * 0.62 + 50;
  return (
    <g opacity={o} transform={`translate(${x} ${y}) rotate(${rot}) scale(${0.85 + 0.15 * o})`}>
      <rect x={-w / 2 + 5} y={-size * 0.95 + 4} width={w} height={size * 1.6} rx={10} fill="#00000022" />
      <rect x={-w / 2} y={-size * 0.95} width={w} height={size * 1.6} rx={10} fill={fill} stroke={color} strokeWidth={4} />
      <text x={0} y={size * 0.2} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={size} fill={color}>{text}</text>
    </g>
  );
};

// eyes glowing in the grass
export const Eyes: React.FC<{ x: number; y: number; o: number; i?: number }> = ({ x, y, o, i = 0 }) => {
  const f = useCurrentFrame();
  const blink = (f + i * 37) % 110 < 5;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      {[-18, 18].map((dx) => (
        <g key={dx}>
          <ellipse cx={dx} cy={0} rx={12} ry={blink ? 1.5 : 9} fill="#e8f27a" />
          {!blink && <ellipse cx={dx} cy={0} rx={2.5} ry={8} fill="#1a1a10" />}
          <ellipse cx={dx} cy={0} rx={24} ry={18} fill="#e8f27a" opacity={0.12} />
        </g>
      ))}
    </g>
  );
};

export const Mosquito: React.FC<{ x: number; y: number; s?: number; flip?: boolean; dead?: boolean }> = ({ x, y, s = 1, flip = false, dead = false }) => {
  const f = useCurrentFrame();
  const flap = Math.sin(f * 2.2) * 10;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <ellipse cx={-6} cy={-14 - flap * 0.3} rx={14} ry={7} fill="#ffffffaa" stroke={INK} strokeWidth={2.5} transform={`rotate(${-30 + flap} -6 -6)`} />
      <ellipse cx={8} cy={-14 + flap * 0.3} rx={14} ry={7} fill="#ffffffaa" stroke={INK} strokeWidth={2.5} transform={`rotate(${20 - flap} 8 -6)`} />
      <ellipse cx={0} cy={0} rx={18} ry={6} fill="#5a4a3a" stroke={INK} strokeWidth={2.5} />
      <circle cx={20} cy={-2} r={6} fill="#5a4a3a" stroke={INK} strokeWidth={2.5} />
      <line x1={26} y1={0} x2={40} y2={6} stroke={INK} strokeWidth={2.5} />
      {[-10, -2, 6].map((lx) => <path key={lx} d={`M ${lx} 4 L ${lx - 6} 18 L ${lx - 10} 24`} stroke={INK} strokeWidth={2} fill="none" />)}
      {dead && <text x={18} y={2} textAnchor="middle" fontFamily={HAND} fontSize={12} fill="#fff">x</text>}
    </g>
  );
};

export const Leaf: React.FC<{ x: number; y: number; r: number; s?: number }> = ({ x, y, r, s = 1 }) => (
  <g transform={`translate(${x} ${y}) rotate(${r}) scale(${s})`}>
    <Shape d="M -40 0 Q 0 -26 40 0 Q 0 26 -40 0 Z" fill={C.leaf} sw={3.5} />
    <path d="M -36 0 L 36 0 M -10 0 L 2 -10 M 10 0 L 22 -10 M -10 0 L 2 10 M 10 0 L 22 10" stroke={INK} strokeWidth={2.5} opacity={0.6} />
  </g>
);

// a draw-on red cross over something that's missing
export const Cross: React.FC<{ x: number; y: number; r: number; t: number }> = ({ x, y, r, t }) => {
  const a = clamp(t * 2); const b = clamp(t * 2 - 1);
  return (
    <g stroke={C.red} strokeWidth={12} strokeLinecap="round">
      {a > 0 && <line x1={x - r} y1={y - r} x2={x - r + 2 * r * a} y2={y - r + 2 * r * a} />}
      {b > 0 && <line x1={x + r} y1={y - r} x2={x + r - 2 * r * b} y2={y - r + 2 * r * b} />}
    </g>
  );
};

export const Bubble: React.FC<{ x: number; y: number; w: number; h: number; o: number; from: [number, number]; children?: React.ReactNode }> = ({ x, y, w, h, o, from, children }) => (
  <g opacity={o}>
    {[0.3, 0.55].map((k, i) => (
      <Shape key={i} d={`M ${lerp(from[0], x, k) - 10 - i * 6} ${lerp(from[1], y + h / 2, k)} a ${10 + i * 6} ${8 + i * 5} 0 1 0 ${2 * (10 + i * 6)} 0 a ${10 + i * 6} ${8 + i * 5} 0 1 0 ${-2 * (10 + i * 6)} 0`} fill="#fbf4e4" sw={4} />
    ))}
    <Shape d={`M ${x - w / 2} ${y} Q ${x - w / 2} ${y - h / 2} ${x - w / 4} ${y - h / 2} Q ${x} ${y - h * 0.62} ${x + w / 4} ${y - h / 2}
      Q ${x + w / 2} ${y - h / 2} ${x + w / 2} ${y} Q ${x + w / 2} ${y + h / 2} ${x + w / 4} ${y + h / 2} Q ${x} ${y + h * 0.62} ${x - w / 4} ${y + h / 2}
      Q ${x - w / 2} ${y + h / 2} ${x - w / 2} ${y} Z`} fill="#fbf4e4" />
    {children}
  </g>
);
