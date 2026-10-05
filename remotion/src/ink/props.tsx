import React from 'react';
import { useCurrentFrame } from 'remotion';
import { Bubble, C, Glow, HAND, INK, Shape, clamp, lerp, rng } from './kit';

// =============================================================================
// Ink props for episodes: everything a shot can place by name. Same rules as
// the kit - ink outline, colour printed slightly off it.
// =============================================================================

export const Mound: React.FC<{ x: number; y: number; w?: number; h?: number; seed?: number }> = ({ x, y, w = 420, h = 70, seed = 3 }) => {
  if (h < 2) return null;
  const r = rng(seed);
  return (
    <g>
      <Shape d={`M ${x - w / 2} ${y} Q ${x - w / 2} ${y - h} ${x} ${y - h} Q ${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`} fill="#c9b25e" />
      {Array.from({ length: 30 }, (_, i) => {
        const u = r() - 0.5; const v = r();
        const px = x + u * w * 0.9; const top = y - h * Math.sqrt(Math.max(0, 1 - (2 * u) ** 2)) * 0.95;
        const py = lerp(top + 6, y - 4, v * 0.8);
        return <line key={i} x1={px} y1={py} x2={px + (r() - 0.5) * 40} y2={py - 4 - r() * 8} stroke="#7d6a2e" strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
};

export const Zzz: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {[0, 1, 2].map((i) => {
        const k = (f / 40 + i / 3) % 1;
        return <text key={i} x={x + k * 60} y={y - k * 110} fontFamily={HAND} fontWeight={700} fontSize={30 + k * 28} fill="#fbf4e4"
          stroke={INK} strokeWidth={1.5} opacity={Math.sin(k * Math.PI)}>z</text>;
      })}
    </g>
  );
};

// a big cat seen side-on, walking (leopard, or Megantereon with sabre teeth)
export const BigCat: React.FC<{ x: number; y: number; s?: number; sabre?: boolean; still?: boolean; flip?: boolean }> = ({ x, y, s = 1, sabre = false, still = false, flip = false }) => {
  const f = useCurrentFrame();
  const sw = still ? 0 : Math.sin(f / 5) * 16;
  const coat = sabre ? '#c69a62' : '#d9a14e';
  const leg = (lx: number, a: number) => `M ${lx} -70 L ${lx + Math.sin((a * Math.PI) / 180) * 40} -30 L ${lx + Math.sin((a * Math.PI) / 180) * 30} 0`;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? s : -s} ${s})`}>
      {[[-90, sw], [-60, -sw], [70, -sw], [100, sw]].map(([lx, a], i) => (
        <g key={i} fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path d={leg(lx, a)} stroke={INK} strokeWidth={24} /><path d={leg(lx, a)} stroke={coat} strokeWidth={14} />
        </g>
      ))}
      <path d={`M -120 -110 Q -200 -120 -230 -190 Q -236 -206 -222 -200`} stroke={INK} strokeWidth={18} fill="none" strokeLinecap="round" />
      <path d={`M -120 -110 Q -200 -120 -230 -190`} stroke={coat} strokeWidth={9} fill="none" strokeLinecap="round" />
      <Shape d="M -130 -100 Q -140 -150 -60 -150 L 90 -150 Q 140 -150 140 -100 Q 140 -60 100 -62 L -100 -62 Q -134 -64 -130 -100 Z" fill={coat} />
      {!sabre && [[-90, -120], [-50, -96], [-10, -128], [30, -100], [70, -126], [100, -92], [-20, -80], [50, -78]].map(([sx, sy], i) => (
        <g key={i}><circle cx={sx} cy={sy} r={9} fill="none" stroke={INK} strokeWidth={4} /><circle cx={sx + 2} cy={sy} r={3} fill={INK} /></g>
      ))}
      {sabre && <path d="M -80 -140 l 20 10 M -30 -146 l 20 10 M 20 -146 l 20 10 M 70 -142 l 20 10" stroke={INK} strokeWidth={4} />}
      <Shape d="M 120 -150 Q 120 -200 168 -204 Q 214 -206 222 -168 Q 228 -134 196 -120 Q 160 -108 136 -120 Z" fill={coat} />
      <Shape d="M 140 -196 L 146 -226 L 166 -204 Z M 186 -204 L 200 -230 L 210 -200 Z" fill={coat} sw={4} />
      <ellipse cx={196} cy={-176} rx={7} ry={6} fill="#e8f27a" stroke={INK} strokeWidth={3} />
      <ellipse cx={197} cy={-176} rx={2} ry={5} fill={INK} />
      <path d="M 220 -158 Q 214 -146 204 -146" stroke={INK} strokeWidth={4} fill="none" />
      {sabre && <Shape d="M 198 -142 L 204 -96 L 212 -142 Z" fill="#fbf4e4" sw={3.5} />}
    </g>
  );
};

export const CatEyes: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => {
  const f = useCurrentFrame();
  const blink = f % 120 < 6;
  return (
    <g opacity={o} transform={`translate(${x} ${y})`}>
      {[-170, 170].map((dx) => (
        <g key={dx}>
          <ellipse cx={dx} cy={0} rx={200} ry={140} fill="#e8f27a" opacity={0.08} />
          <Shape d={`M ${dx - 120} 0 Q ${dx} ${blink ? -6 : -90} ${dx + 120} 0 Q ${dx} ${blink ? 6 : 90} ${dx - 120} 0 Z`} fill="#e8d84a" sw={6} />
          {!blink && <ellipse cx={dx} cy={0} rx={14} ry={74} fill={INK} />}
          {!blink && <circle cx={dx + 30} cy={-30} r={10} fill="#fffbe0" />}
        </g>
      ))}
    </g>
  );
};

export const Bones: React.FC<{ x: number; y: number; s?: number; burnt?: boolean }> = ({ x, y, s = 1, burnt = false }) => {
  const c = burnt ? '#6a5a4c' : '#efe6d0';
  const bone = (bx: number, by: number, r: number, len: number) => (
    <g transform={`translate(${bx} ${by}) rotate(${r})`}>
      <Shape d={`M ${-len / 2} -8 L ${len / 2} -8 A 12 12 0 1 1 ${len / 2} 8 L ${-len / 2} 8 A 12 12 0 1 1 ${-len / 2} -8 Z`} fill={c} sw={4} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {bone(-120, -10, 12, 150)}{bone(40, -20, -18, 180)}{bone(-20, -40, 70, 110)}{bone(140, -6, 6, 90)}
      <Shape d="M -60 -30 Q -60 -100 0 -104 Q 60 -100 60 -40 Q 60 -10 30 -6 L -30 -6 Q -60 -10 -60 -30 Z" fill={c} sw={4.5} />
      <ellipse cx={-22} cy={-58} rx={12} ry={14} fill={INK} /><ellipse cx={22} cy={-58} rx={12} ry={14} fill={INK} />
      <path d="M -16 -20 L -16 -8 M 0 -20 L 0 -8 M 16 -20 L 16 -8" stroke={INK} strokeWidth={4} />
    </g>
  );
};

// a night bar: blocks of sleep/awake across the dark hours
export const SleepBar: React.FC<{ x: number; y: number; blocks: [string, number][]; t: number; labels?: boolean; squeeze?: number; o?: number }> = ({
  x, y, blocks, t, labels = false, squeeze = 0, o = 1 }) => {
  const w = 1160; const x0 = x - w / 2;
  // squeezing: awake blocks shrink away and the sleep closes into one block
  const bs = blocks.map(([k, len]) => [k, k === 'awake' ? len * (1 - squeeze) : len] as [string, number]);
  const total = bs.reduce((a, [, l]) => a + l, 0);
  let acc = 0;
  return (
    <g opacity={o}>
      <Shape d={`M ${x0} ${y - 32} L ${x0 + w} ${y - 32} L ${x0 + w} ${y + 32} L ${x0} ${y + 32} Z`} />
      {bs.map(([k, len], i) => {
        const a = acc / total; acc += len; const b = acc / total;
        const shown = clamp((t - a) / Math.max(0.001, b - a));
        if (k === 'none' || shown <= 0) return null;
        const bx = x0 + 2 + (w - 4) * a; const bw = (w - 4) * (b - a) * shown;
        return (
          <g key={i}>
            <rect x={bx} y={y - 30} width={bw} height={60} fill={k === 'sleep' ? '#4a5a8a' : C.ochre} />
            {labels && shown > 0.9 && (b - a) > 0.06 && (
              <text x={bx + (w - 4) * (b - a) / 2} y={y + 11} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={28}
                fill="#fbf4e4">{k === 'sleep' ? 'SLEEP' : 'AWAKE'}</text>
            )}
          </g>
        );
      })}
      <text x={x0} y={y + 80} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#6a5a4a">sunset</text>
      <text x={x0 + w} y={y + 80} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#6a5a4a">sunrise</text>
    </g>
  );
};

export const Clock: React.FC<{ x: number; y: number; s?: number; dark?: number; time?: number }> = ({ x, y, s = 1, dark, time }) => {
  const f = useCurrentFrame();
  const R = 120;
  const arc = (h0: number, h1: number, n: number) => {
    const a0 = (h0 / n) * Math.PI * 2 - Math.PI / 2; const a1 = (h1 / n) * Math.PI * 2 - Math.PI / 2;
    return `M 0 0 L ${Math.cos(a0) * R} ${Math.sin(a0) * R} A ${R} ${R} 0 ${h1 - h0 > n / 2 ? 1 : 0} 1 ${Math.cos(a1) * R} ${Math.sin(a1) * R} Z`;
  };
  const hour = time ?? (f / 30) % 12;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Shape d={`M ${-R} 0 A ${R} ${R} 0 1 1 ${R} 0 A ${R} ${R} 0 1 1 ${-R} 0 Z`} fill="#fbf4e4" sw={7} />
      {dark !== undefined && <path d={arc(0, dark, 24)} fill="#283050" opacity={0.85} />}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2;
        return <line key={i} x1={Math.sin(a) * (R - 18)} y1={-Math.cos(a) * (R - 18)} x2={Math.sin(a) * (R - 6)} y2={-Math.cos(a) * (R - 6)} stroke={INK} strokeWidth={5} />;
      })}
      {time !== undefined && (
        <>
          <line x1={0} y1={0} x2={Math.sin((hour / 12) * Math.PI * 2) * 60} y2={-Math.cos((hour / 12) * Math.PI * 2) * 60} stroke={INK} strokeWidth={9} strokeLinecap="round" />
          <line x1={0} y1={0} x2={0} y2={-90} stroke={INK} strokeWidth={6} strokeLinecap="round" />
        </>
      )}
      {dark !== undefined && <text x={0} y={R + 56} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={INK}>24 HOURS</text>}
      <circle cx={0} cy={0} r={8} fill={INK} />
    </g>
  );
};

export const Calendar: React.FC<{ x: number; y: number; text: string; s?: number }> = ({ x, y, text, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -130 -110 L 130 -110 L 130 120 L -130 120 Z" fill="#fbf4e4" sw={6} />
    <rect x={-130} y={-110} width={260} height={56} fill={C.red} />
    <path d="M -130 -110 L 130 -110 L 130 120 L -130 120 Z M -130 -54 L 130 -54" stroke={INK} strokeWidth={6} fill="none" />
    {[-70, 0, 70].map((rx) => <circle key={rx} cx={rx} cy={-110} r={10} fill="#fbf4e4" stroke={INK} strokeWidth={5} />)}
    <text x={0} y={52} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={text.length > 6 ? 46 : 64} fill={INK}>{text}</text>
  </g>
);

export const Bed: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -300 0 L -300 -120 L -280 -120 L -280 -60 L 280 -60 L 280 -90 L 300 -90 L 300 0 Z" fill="#7a5638" />
    <Shape d="M -280 -60 L -280 -96 L 280 -96 L 280 -60 Z" fill="#e8e2d4" />
    <Shape d="M -100 -96 Q -100 -120 -60 -120 L 280 -118 L 280 -60 L -100 -60 Z" fill="#6f86b0" />
  </g>
);

export const Candle: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 3;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-110} r={220} o={0.9} id={`cg${Math.round(x)}`} color="#ffcf6a" />
      <Shape d="M -40 0 L 40 0 L 30 -14 L -30 -14 Z" fill="#8a6a4a" sw={4} />
      <Shape d="M -16 -14 L -16 -90 L 16 -90 L 16 -14 Z" fill="#f4ecd8" sw={4} />
      <Shape d={`M 0 -96 Q -12 -110 ${sw} -136 Q 12 -110 0 -96 Z`} fill={C.ember} sw={3} />
    </g>
  );
};

export const Book: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -220 -110 Q -110 -140 0 -110 L 0 110 Q -110 80 -220 110 Z" fill="#f4ecd8" sw={6} />
    <Shape d="M 220 -110 Q 110 -140 0 -110 L 0 110 Q 110 80 220 110 Z" fill="#efe4c8" sw={6} />
    {[-70, -40, -10, 20, 50].map((ly) => (
      <g key={ly} stroke={INK} strokeWidth={3} opacity={0.55}>
        <path d={`M -190 ${ly} Q -110 ${ly - 16} -30 ${ly}`} fill="none" /><path d={`M 30 ${ly} Q 110 ${ly - 16} 190 ${ly}`} fill="none" />
      </g>
    ))}
  </g>
);

export const Flute: React.FC<{ x: number; y: number; s?: number; holes?: number }> = ({ x, y, s = 1, holes = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s}) rotate(-6)`}>
    <Shape d="M -330 -26 Q -350 -26 -350 0 Q -350 26 -330 26 L 320 22 Q 346 20 346 0 Q 346 -20 320 -22 Z" fill="#e8dcbc" sw={6} />
    <path d="M -300 -12 Q -100 -20 200 -10 M -260 12 Q 0 18 260 10" stroke={INK} strokeWidth={2.5} opacity={0.35} fill="none" />
    {[0, 1, 2, 3, 4].map((i) => {
      const lit = holes > i / 5;
      return (
        <g key={i}>
          <ellipse cx={-120 + i * 70} cy={0} rx={13} ry={10} fill={INK} />
          {lit && <circle cx={-120 + i * 70} cy={0} r={26} fill="none" stroke={C.red} strokeWidth={5} />}
        </g>
      );
    })}
  </g>
);

export const Notes: React.FC<{ x: number; y: number; o?: number }> = ({ x, y, o = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o}>
      {[0, 1, 2, 3].map((i) => {
        const k = (f / 70 + i / 4) % 1;
        const nx = x + Math.sin(k * 6 + i) * 40 + i * 30; const ny = y - k * 260;
        return (
          <g key={i} opacity={Math.sin(k * Math.PI)} transform={`translate(${nx} ${ny})`}>
            <ellipse cx={0} cy={0} rx={16} ry={12} fill={INK} transform="rotate(-20)" />
            <line x1={14} y1={-4} x2={14} y2={-60} stroke={INK} strokeWidth={5} />
            {i % 2 === 0 && <path d="M 14 -60 Q 36 -50 32 -30" stroke={INK} strokeWidth={5} fill="none" />}
          </g>
        );
      })}
    </g>
  );
};

// a baboon bone with notches carved one by one (n = how many so far)
export const NotchBone: React.FC<{ x: number; y: number; s?: number; n: number; count?: boolean }> = ({ x, y, s = 1, n, count = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -300 -22 Q -330 -50 -350 -24 Q -366 0 -350 24 Q -330 50 -300 22 L 300 18 Q 330 46 350 22 Q 362 0 350 -22 Q 330 -46 300 -18 Z" fill="#dccba4" sw={6} />
    {Array.from({ length: Math.round(n) }, (_, i) => (
      <line key={i} x1={-260 + i * 18.6} y1={-16} x2={-262 + i * 18.6} y2={14} stroke={INK} strokeWidth={4} strokeLinecap="round" />
    ))}
    {count && <text x={0} y={-80} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill={C.rust}>{Math.round(n)} NOTCHES</text>}
  </g>
);

export const Phase: React.FC<{ x: number; y: number; r: number; k: number }> = ({ x, y, r, k }) => {
  const c = Math.cos(k * Math.PI * 2); const rx = Math.abs(c) * r;
  const waxing = k <= 0.5; const crescent = c > 0;
  const limb = waxing ? 1 : 0; const term = waxing ? (crescent ? 0 : 1) : (crescent ? 1 : 0);
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill="#3a4357" stroke={INK} strokeWidth={4} />
      {k > 0.01 && k < 0.99 && <path d={`M ${x} ${y - r} A ${r} ${r} 0 0 ${limb} ${x} ${y + r} A ${rx} ${r} 0 0 ${term} ${x} ${y - r} Z`} fill="#f6e7b8" />}
    </g>
  );
};

export const MoonRow: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => (
  <g opacity={o}>
    {Array.from({ length: 8 }, (_, i) => <Phase key={i} x={x - 420 + i * 120} y={y} r={44} k={i / 8} />)}
  </g>
);

export const StreetLamp: React.FC<{ x: number; y: number; on: number }> = ({ x, y, on }) => (
  <g transform={`translate(${x} ${y})`}>
    <Glow x={0} y={-420} r={340} o={on} id={`sl${Math.round(x)}`} color="#ffcf6a" />
    <Shape d="M -8 0 L -8 -380 L 8 -380 L 8 0 Z" fill="#3a3f55" />
    <Shape d="M -40 -380 L 40 -380 L 30 -460 L -30 -460 Z" fill={on > 0.5 ? '#ffe39a' : '#5a6070'} />
    <Shape d="M -46 -460 L 46 -460 L 0 -500 Z" fill="#3a3f55" />
  </g>
);

export const Hut: React.FC<{ x: number; y: number; s?: number; lit?: boolean }> = ({ x, y, s = 1, lit = true }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -150 0 L -150 -160 L 150 -160 L 150 0 Z" fill="#b08a5a" />
    <Shape d="M -190 -150 L 0 -330 L 190 -150 Z" fill="#c9a85e" />
    <path d="M -150 -200 L 150 -200 M -120 -230 L 120 -230 M -80 -265 L 80 -265" stroke={INK} strokeWidth={3} opacity={0.4} />
    <Shape d="M -40 0 L -40 -110 Q 0 -140 40 -110 L 40 0 Z" fill={lit ? '#ffcf6a' : '#3a2a20'} />
  </g>
);

export const Subscribe: React.FC<{ x: number; y: number; o: number }> = ({ x, y, o }) => {
  const f = useCurrentFrame();
  return (
    <g opacity={o} transform={`translate(${x} ${y}) scale(${(0.8 + 0.2 * o) * (1 + 0.03 * Math.sin(f / 6))})`}>
      <rect x={-260 + 8} y={-70 + 8} width={520} height={140} rx={30} fill="#00000033" />
      <Shape d="M -230 -70 L 230 -70 Q 260 -70 260 -40 L 260 40 Q 260 70 230 70 L -230 70 Q -260 70 -260 40 L -260 -40 Q -260 -70 -230 -70 Z" fill={C.red} sw={6} />
      <text x={20} y={22} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={64} fill="#fbf4e4">SUBSCRIBE</text>
    </g>
  );
};

export const Magnifier: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const mx = x + Math.cos(f / 25) * 80; const my = y + Math.sin(f / 25) * 40;
  return (
    <g transform={`translate(${mx} ${my})`}>
      <path d="M 70 70 L 170 170" stroke={INK} strokeWidth={36} strokeLinecap="round" />
      <path d="M 70 70 L 170 170" stroke="#8a5a3a" strokeWidth={24} strokeLinecap="round" />
      <circle cx={0} cy={0} r={100} fill="#cfe6f0" opacity={0.6} stroke={INK} strokeWidth={10} />
      <path d="M -50 -40 Q -30 -70 10 -76" stroke="#fff" strokeWidth={8} fill="none" strokeLinecap="round" />
    </g>
  );
};

export const ClueCard: React.FC<{ x: number; y: number; text: string; o: number }> = ({ x, y, text, o }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * o}) rotate(${(Number(text) - 2) * 4})`}>
    <Shape d="M -110 -80 L 110 -80 L 110 80 L -110 80 Z" fill="#fbf4e4" sw={5} />
    <text x={0} y={-20} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill={C.rust}>CLUE {text}</text>
    <text x={0} y={60} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={80} fill={INK}>?</text>
  </g>
);

export const Clipboard: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -120 -160 L 120 -160 L 120 160 L -120 160 Z" fill="#a8835a" sw={6} />
    <Shape d="M -96 -130 L 96 -130 L 96 140 L -96 140 Z" fill="#fbf4e4" sw={4} />
    <Shape d="M -40 -176 L 40 -176 L 40 -140 L -40 -140 Z" fill="#8a93a6" sw={4} />
    {[-90, -50, -10, 30, 70].map((ly, i) => (
      <g key={ly}>
        <rect x={-74} y={ly} width={20} height={20} fill="none" stroke={INK} strokeWidth={3} />
        {i < 3 && <path d={`M -72 ${ly + 10} l 6 8 l 12 -16`} stroke={C.red} strokeWidth={4} fill="none" />}
        <line x1={-40} y1={ly + 10} x2={70} y2={ly + 10} stroke={INK} strokeWidth={3} opacity={0.5} />
      </g>
    ))}
  </g>
);

export const Desk: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -150 -130 L 150 -130 L 150 -110 L -150 -110 Z" fill="#7a5638" />
    <Shape d="M -130 -110 L -120 0 M 130 -110 L 120 0" sw={10} />
    <Shape d="M -60 -134 L 60 -134 L 70 -150 L -50 -150 Z" fill="#f4ecd8" sw={3} />
  </g>
);

export const Rock: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -150 -10 Q -140 -80 -40 -84 Q 80 -90 120 -40 Q 140 -10 110 0 L -130 2 Q -156 0 -150 -10 Z" fill={C.rock} />
  </g>
);

export const DreamIcons: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const f = useCurrentFrame();
  const bob = (i: number) => Math.sin(f / 10 + i) * 6;
  return (
    <g>
      <path d={`M ${x - 90} ${y - 20 + bob(0)} a 30 30 0 1 0 30 -30 a 22 22 0 1 1 -30 30 Z`} fill="#f6e7b8" stroke={INK} strokeWidth={3} />
      <g transform={`translate(${x + 10} ${y + bob(1)})`}>
        <Shape d="M -36 0 Q 0 -26 36 0 Q 0 26 -36 0 Z M 36 0 L 56 -16 L 56 16 Z" fill="#7fb0d0" sw={3} />
      </g>
      <path d={`M ${x + 70} ${y - 30 + bob(2)} q 14 -14 28 0 q 14 -14 28 0`} stroke={INK} strokeWidth={4} fill="none" />
    </g>
  );
};

export { Bubble };
