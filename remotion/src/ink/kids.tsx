import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, Glow, HAND, INK, Shape, clamp, lerp, rng } from './kit';

// =============================================================================
// Pieces for "What was it like to be a child 30,000 years ago?": a footprint
// trail that appears step by step, an eagle, finger lines on a cave wall, a
// torch, a heap of beads with a counter, stone toy balls, the painted ceiling
// and a fossil skeleton.
// =============================================================================

// bare footprints appearing step by step (t 0..1): adult prints, small ones beside
// them while the toddler walks (kid = [from, to] of the trail), smears where they slipped
export const Footprints: React.FC<{ x0: number; y0: number; x1: number; y1: number; t: number; kid?: [number, number]; slips?: number[]; n?: number; onlyKid?: boolean;
  s?: number; color?: string }> = ({ x0, y0, x1, y1, t, kid, slips = [], n = 14, onlyKid = false, s: k = 1, color = '#5a4a32' }) => {
  const ang = (Math.atan2(y1 - y0, x1 - x0) * 180) / Math.PI;
  const foot = (x: number, y: number, s: number, side: number, key: string, slip: boolean) => (
    <g key={key} transform={`translate(${x} ${y + side * 18 * s * k}) rotate(${ang + 90}) scale(${s * k})`}>
      {slip ? <path d="M -12 -34 Q 0 -66 16 -34 L 20 30 Q 0 48 -16 30 Z" fill="#6b5a3e" opacity={0.75} />
        : <path d="M -12 0 Q -14 -26 0 -28 Q 14 -26 12 0 Q 12 22 0 26 Q -12 22 -12 0 Z" fill={color} opacity={0.85} />}
      {!slip && [-9, -3, 3, 9].map((dx, i) => <circle key={i} cx={dx} cy={-34 + Math.abs(dx) / 3} r={i === 0 ? 4 : 3} fill={color} opacity={0.85} />)}
    </g>
  );
  return (
    <g>
      {Array.from({ length: n }, (_, i) => i / (n - 1)).map((u, i) => {
        if (u > t + 0.0001) return null;
        const x = lerp(x0, x1, u); const y = lerp(y0, y1, u);
        const out: React.ReactNode[] = [];
        if (!onlyKid) out.push(foot(x, y, 1, i % 2 ? 1 : -1, `a${i}`, slips.includes(i)));
        if (kid && u >= kid[0] && u <= kid[1]) out.push(foot(x + 14 * k, y + 70 * k, 0.55, i % 2 ? -1 : 1, `k${i}`, false));
        return out;
      })}
    </g>
  );
};

export const Eagle: React.FC<{ x: number; y: number; s?: number; flip?: boolean }> = ({ x, y, s = 1, flip = false }) => {
  const f = useCurrentFrame();
  const flap = Math.sin(f / 3) * 26;
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s})`}>
      <Shape d={`M -20 -10 Q -120 ${-80 - flap} -230 ${-40 - flap} Q -150 -10 -40 10 Z`} fill="#6a4a30" />
      <Shape d={`M 20 -10 Q 120 ${-80 - flap} 230 ${-40 - flap} Q 150 -10 40 10 Z`} fill="#7a5638" />
      <Shape d="M -50 0 Q 0 -30 60 -4 Q 80 10 60 24 Q 0 40 -60 20 Q -80 10 -50 0 Z" fill="#5a3a22" />
      <Shape d="M -60 10 L -110 -6 L -110 30 Z" fill="#5a3a22" sw={4} />
      <Shape d="M 56 -10 Q 90 -34 112 -12 Q 120 4 100 10 Q 80 14 60 10 Z" fill="#f3ead8" />
      <Shape d="M 108 -10 L 132 -2 L 108 6 Z" fill="#d9a14e" sw={3.5} />
      <circle cx={96} cy={-12} r={4.5} fill={INK} />
      {[-14, 10].map((dx) => (
        <path key={dx} d={`M ${dx} 30 L ${dx - 6} 58 M ${dx - 6} 58 l -10 8 M ${dx - 6} 58 l 2 12 M ${dx - 6} 58 l 10 8`}
          stroke={INK} strokeWidth={5} strokeLinecap="round" fill="none" />
      ))}
    </g>
  );
};

// wavy finger lines appearing on a cave wall (t 0..1); small = a three-year-old's fingers
export const Flutings: React.FC<{ x: number; y: number; t: number; small?: boolean; seed?: number }> = ({ x, y, t, small = false, seed = 4 }) => {
  const r = rng(seed);
  const strokes = Array.from({ length: 6 }, () => ({ dx: (r() - 0.5) * 420, dy: (r() - 0.5) * 160, a: r() * 6, len: 220 + r() * 220 }));
  const gap = small ? 9 : 17; const w = small ? 6 : 11;
  return (
    <g transform={`translate(${x} ${y})`}>
      {strokes.map((st, i) => {
        const k = clamp(t * strokes.length - i);
        if (k <= 0) return null;
        const pts = Array.from({ length: 24 }, (_, j) => j / 23).filter((u) => u <= k);
        return [0, 1, 2].map((fi) => (
          <polyline key={`${i}-${fi}`} fill="none" stroke="#3a2a20" strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" opacity={0.75}
            points={pts.map((u) => `${st.dx - st.len / 2 + u * st.len},${st.dy + fi * gap + Math.sin(u * 5 + st.a) * 34}`).join(' ')} />
        ));
      })}
    </g>
  );
};

export const Torch: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  const sw = Math.sin(f / 4) * 6;
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <Glow x={0} y={-110} r={360} o={0.9} id={`tg${Math.round(x)}`} color="#ffb35c" />
      <Shape d="M -8 0 L -14 -100 L 14 -100 L 8 0 Z" fill="#7a5638" sw={4} />
      <Shape d={`M -22 -100 Q -28 -150 ${sw} -200 Q 26 -150 22 -100 Z`} fill="#ff9a3d" sw={4} />
      <path d={`M -10 -104 Q -12 -136 ${sw / 2} -160 Q 12 -136 10 -104 Z`} fill="#ffe39a" />
      {[0, 1, 2].map((i) => {
        const k = (f / 50 + i / 3) % 1;
        return <circle key={i} cx={sw + Math.sin(k * 6 + i) * 20} cy={-210 - k * 160} r={14 + k * 26} fill="#3a3430" opacity={0.25 * (1 - k)} />;
      })}
    </g>
  );
};

// a heap of ivory beads that grows with t, with a counter
export const Beads: React.FC<{ x: number; y: number; t: number; count?: number }> = ({ x, y, t, count = 13000 }) => {
  const r = rng(77); const n = Math.floor(260 * t);
  return (
    <g>
      {Array.from({ length: 260 }, (_, i) => {
        const a = r() * Math.PI; const d = Math.sqrt(r()) * 330;
        const bx = x + Math.cos(a) * d * 1.4; const by = y - Math.sin(a) * d * 0.45;
        return i < n ? <circle key={i} cx={bx} cy={by} r={7} fill="#f4ecd8" stroke={INK} strokeWidth={2.5} /> : null;
      })}
      <text x={x} y={y - 230} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={80} fill={C.rust}>
        {Math.round(count * t).toLocaleString('en-US')}+ BEADS</text>
    </g>
  );
};

export const StoneBalls: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => {
  const f = useCurrentFrame();
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      {[-90, 0, 90].map((dx, i) => {
        const roll = Math.sin(f / 18 + i) * 12;
        return (
          <g key={dx} transform={`translate(${dx + roll} 0) rotate(${roll * 4})`}>
            <Shape d="M -38 0 A 38 38 0 1 1 38 0 A 38 38 0 1 1 -38 0 Z" fill={['#a89a86', '#8c7a68', '#b8a58a'][i]} sw={5} />
            <path d="M -16 -14 Q -4 -22 8 -16" stroke={INK} strokeWidth={3} fill="none" opacity={0.5} />
          </g>
        );
      })}
    </g>
  );
};

// the painted ceiling: red-ochre bison appear one by one (t 0..1)
export const Ceiling: React.FC<{ t: number }> = ({ t }) => {
  const bison = (x: number, y: number, s: number, k: number, key: number) => (
    <g key={key} opacity={k} transform={`translate(${x} ${y}) scale(${s})`}>
      <path d="M -120 20 Q -130 -50 -60 -70 Q 0 -110 70 -60 Q 120 -40 120 10 Q 110 50 60 46 L -80 50 Q -118 46 -120 20 Z" fill="#b9553a" opacity={0.85} />
      <path d="M 70 -60 Q 110 -70 130 -40 Q 140 -10 118 4" fill="#2a2320" opacity={0.8} />
      {[-80, -40, 40, 80].map((lx) => <path key={lx} d={`M ${lx} 46 L ${lx - 4} 96`} stroke="#2a2320" strokeWidth={10} strokeLinecap="round" opacity={0.8} />)}
      <path d="M 116 -60 Q 130 -84 112 -96" stroke="#2a2320" strokeWidth={7} fill="none" />
    </g>
  );
  const spots: [number, number, number][] = [[400, 260, 1], [900, 200, 1.2], [1420, 280, 1], [650, 470, 0.9], [1180, 480, 1.1]];
  return <g>{spots.map(([x, y, s], i) => bison(x, y, s, clamp(t * spots.length - i), i))}</g>;
};

// a fossil skeleton lying down (simple and readable)
export const Skeleton: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} stroke={INK} strokeWidth={5} strokeLinecap="round" fill="#efe6d0">
    <ellipse cx={-230} cy={0} rx={44} ry={38} />
    <ellipse cx={-238} cy={-4} rx={9} ry={10} fill={INK} /><ellipse cx={-214} cy={-4} rx={9} ry={10} fill={INK} />
    <line x1={-186} y1={0} x2={60} y2={0} />
    {[-160, -130, -100, -70, -40].map((rx) => <path key={rx} d={`M ${rx} -34 Q ${rx + 10} 0 ${rx} 34`} fill="none" />)}
    <ellipse cx={80} cy={0} rx={30} ry={40} />
    <path d="M 100 -20 L 240 -40 L 330 -30 M 100 20 L 240 40 L 330 30" fill="none" />
    <path d="M -150 -36 L -80 -90 L -10 -120 M -150 36 L -80 90 L -10 120" fill="none" />
  </g>
);

// a small child's skull, side-on; talons = the scratch marks around the eye socket
export const ChildSkull: React.FC<{ x: number; y: number; s?: number; talons?: boolean }> = ({ x, y, s = 1, talons = false }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -190 30 Q -200 -150 -20 -180 Q 150 -190 190 -60 Q 205 10 160 40 L 150 90 Q 100 120 40 110 L -40 100 Q -150 110 -190 30 Z" fill="#e8dcbc" sw={8} />
    <Shape d="M 60 -40 Q 110 -60 140 -20 Q 150 20 110 34 Q 70 40 56 6 Z" fill="#3a2a20" sw={6} />
    <Shape d="M 150 50 L 196 60 L 170 92 Z" fill="#3a2a20" sw={5} />
    <path d="M 40 110 L 50 140 M 70 112 L 78 142 M 100 108 L 106 138 M 130 98 L 134 126" stroke={INK} strokeWidth={6} strokeLinecap="round" />
    <path d="M -120 -60 Q -60 -100 0 -90" stroke={INK} strokeWidth={4} fill="none" opacity={0.5} />
    {talons && <g stroke={C.red} strokeWidth={8} strokeLinecap="round">
      <path d="M 40 -80 L 70 -58" /><path d="M 150 -78 L 128 -54" /><path d="M 160 26 L 136 14" /><path d="M -10 -120 Q 20 -40 30 20" fill="none" />
    </g>}
  </g>
);

// a little clay doll
export const Doll: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <Shape d="M -70 160 L -40 -20 Q 0 -40 40 -20 L 70 160 Z" fill="#b9553a" sw={7} />
    <Shape d="M -50 -90 A 50 50 0 1 1 50 -90 A 50 50 0 1 1 -50 -90 Z" fill="#d9a14e" sw={7} />
    <circle cx={-16} cy={-96} r={6} fill={INK} /><circle cx={16} cy={-96} r={6} fill={INK} />
    <path d="M -14 -70 Q 0 -60 14 -70" stroke={INK} strokeWidth={5} fill="none" />
    <Shape d="M -40 0 L -110 50 M 40 0 L 110 50" sw={18} ink="#b9553a" />
    <path d="M -30 40 L 30 40 M -40 90 L 40 90" stroke={INK} strokeWidth={4} opacity={0.5} />
  </g>
);

// the Sungir grave: two children laid head to head, beads all over them
export const Grave: React.FC<{ x: number; y: number }> = ({ x, y }) => {
  const r = rng(31);
  const kid = (dir: number) => (
    <g transform={`translate(${dir * 230} 0) scale(${dir} 1)`}>
      <Shape d="M -210 0 A 40 36 0 1 0 -130 0 A 40 36 0 1 0 -210 0 Z" fill="#a8714c" sw={5} />
      <Shape d="M -130 -30 L 60 -34 Q 80 0 60 34 L -130 30 Z" fill="#d9a14e" sw={5} />
      <path d="M 60 -20 L 170 -26 M 60 20 L 170 26" stroke={INK} strokeWidth={14} strokeLinecap="round" />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      <Shape d="M -520 -150 Q 0 -190 520 -150 Q 560 0 520 150 Q 0 190 -520 150 Q -560 0 -520 -150 Z" fill="#8a6a4a" />
      {kid(1)}{kid(-1)}
      {Array.from({ length: 140 }, (_, i) => {
        const bx = (r() - 0.5) * 860; const by = (r() - 0.5) * 120;
        return <circle key={i} cx={bx} cy={by} r={4.5} fill="#f4ecd8" stroke={INK} strokeWidth={1.5} />;
      })}
    </g>
  );
};
