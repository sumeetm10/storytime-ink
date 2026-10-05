import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import InkPilot from './InkPilot';
import {
  Acacia, Boil, Bubble, C, Eyes, Fire, Glow, H, HAND, INK, InkFonts, useInkFont, Moon, Person, Shape, Stars, Tag, Tuft, W,
  clamp, easeInOut, easeOut, lerp, prog,
} from './kit';
import type { Mood, Outfit, Pose } from './kit';
import {
  Bed, BigCat, Bones, Book, Calendar, Candle, CatEyes, Clipboard, ClueCard, Clock, Desk, DreamIcons, Flute, Hut, Magnifier,
  Mound, MoonRow, NotchBone, Notes, Rock, SleepBar, StreetLamp, Subscribe, Zzz,
} from './props';

// =============================================================================
// An ink episode for Story_time10, drawn from data: props.shots comes from an
// episode file (doodle-engine/episodes/*.py) via ink_episode.py. The opening
// lines can be the approved pilot (InkPilot); every later shot is a background,
// a cast from CAST in named POSES, props by name and hand-lettered tags, timed
// to the narration. Shots cross-fade into each other.
// =============================================================================
type VoLine = { text: string; start: number; end: number };
type El = { at?: number; line?: number; word?: string };
type ActorSpec = El & {
  who: string; x: number; y: number; s?: number; pose?: string; mood?: Mood; look?: number; flip?: boolean; lie?: boolean;
  ghost?: boolean; to?: [number, number]; move?: [number, number]; then?: { at: number; mood?: Mood; pose?: string };
  talk?: [number, number]; phone?: boolean;
};
type PropSpec = El & { k: string; x: number; y: number; s?: number; [key: string]: unknown };
type TagSpec = El & { text: string; x: number; y: number; size?: number; rot?: number; color?: string };
type Shot = {
  from: number; bg: string; chapter?: string; zoom?: [number, number]; focus?: [number, number]; glow?: boolean;
  dark?: [number, number]; lights?: [number, number]; spread?: [number, number];
  actors?: ActorSpec[]; props?: PropSpec[]; tags?: TagSpec[];
  big?: El & { text: string; sub?: string; y?: number; size?: number; light?: boolean };
};
type Props = { vo: VoLine[]; shots: Shot[]; intro?: { lines: number; at: Record<string, number> } | null; durationInSeconds: number };

const CAST: Record<string, { skin: string; tunic: string; hair: 'shaggy' | 'bun' | 'kid' | 'beard' | 'short' | 'bald'; s?: number;
  outfit?: Outfit; hairColor?: string; glasses?: boolean; brow?: boolean }> = {
  dad: { skin: C.skin2, tunic: C.rust, hair: 'beard' },
  mom: { skin: C.skin1, tunic: C.ochre, hair: 'bun' },
  kid: { skin: C.skin3, tunic: C.sage, hair: 'kid', s: 0.7 },
  elder: { skin: C.skin1, tunic: '#8a7a6a', hair: 'bun', hairColor: '#d8d2c8' },
  hominin: { skin: '#5e3c28', tunic: '#5a4030', hair: 'shaggy', brow: true },
  hominin2: { skin: '#6a4430', tunic: '#6b4a32', hair: 'bun', brow: true },
  scientist: { skin: '#e2b996', tunic: '#f4f1ea', hair: 'short', hairColor: '#5a4a3a', outfit: 'coat', glasses: true },
  volunteer: { skin: '#c99a74', tunic: '#5f86b8', hair: 'short', outfit: 'shirt' },
  scholar: { skin: '#e6c09a', tunic: '#5a3a5a', hair: 'bald', hairColor: '#cfc8bd', outfit: 'gown' },
  thief: { skin: '#d2a27a', tunic: '#3a3f55', hair: 'short', outfit: 'shirt' },
  noble: { skin: '#efcaa4', tunic: '#7a2f3a', hair: 'bun', hairColor: '#e8dcc0', outfit: 'gown' },
  noble2: { skin: '#e8c098', tunic: '#2f4a6a', hair: 'short', outfit: 'shirt' },
  modern: { skin: '#b98a62', tunic: '#8a93a6', hair: 'short', outfit: 'shirt' },
};

const POSES: Record<string, Pose> = {
  stand: { la: 12, ra: 12 }, sit: { sit: true, la: 26, lb: -60, ra: 22, rb: -50 }, wave: { la: 12, ra: 140, rb: -40 },
  point: { la: 12, ra: 95, rb: -10 }, scared: { la: 150, lb: 30, ra: 150, rb: 30 }, feed: { sit: true, la: 30, lb: -60, ra: 80, rb: 20 },
  pray: { sit: true, la: 40, lb: -110, ra: 40, rb: -110 }, play: { sit: true, la: 70, lb: -100, ra: 70, rb: -80 },
  write: { sit: true, la: 30, lb: -70, ra: 75, rb: -55 }, sneak: { la: 70, lb: 50, ra: 60, rb: 60, ll: -24, rl: 30 },
  walk: { la: 18, ra: 18 }, drink: { la: 12, ra: 100, rb: -125 }, sitbed: { sit: true, la: 20, lb: -30, ra: 20, rb: -30 },
  think: { la: 12, ra: 140, rb: -150 },
};

const Paper: React.FC = () => <Img src={staticFile('ink/paper.jpg')} style={{ position: 'absolute', width: W, height: H }} />;
const Wash: React.FC<{ o: number; color?: string }> = ({ o, color = '#1d2342' }) =>
  o > 0.001 ? <AbsoluteFill style={{ background: color, mixBlendMode: 'multiply', opacity: o }} /> : null;

const NightSky: React.FC<{ seed?: number }> = ({ seed = 3 }) => (
  <>
    <defs>
      <linearGradient id={`ns${seed}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1b2140" /><stop offset="1" stopColor="#3a3f66" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={W} height={H} fill={`url(#ns${seed})`} />
    <Stars o={1} n={80} maxY={620} seed={seed} />
  </>
);

// ------------------------------------------------------------------ backgrounds
const Background: React.FC<{ shot: Shot; t: (a: number, b: number) => number; f: number }> = ({ shot, t, f }) => {
  const bg = shot.bg;
  if (bg === 'savanna-night' || bg === 'dusk') {
    const night = bg !== 'dusk';
    return (
      <>
        {night ? <NightSky seed={7} /> : (
          <>
            <defs><linearGradient id="duskE" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#9fb7d0" /><stop offset="0.75" stopColor="#f2b98a" /><stop offset="1" stopColor="#f6d39a" />
            </linearGradient></defs>
            <rect x={0} y={0} width={W} height={H} fill="url(#duskE)" opacity={0.92} />
            <Shape d="M 1300 640 a 90 90 0 1 0 180 0 a 90 90 0 1 0 -180 0" fill="#f4a24a" />
          </>
        )}
        <Shape d="M 0 730 Q 300 700 620 722 Q 980 744 1320 710 Q 1640 686 1920 718 L 1920 1080 L 0 1080 Z" fill={night ? '#6f6a3e' : C.grass} />
        <Acacia x={1680} y={740} s={0.85} fill={night ? '#3f5238' : '#6f8a55'} />
        {[[120, 1040], [470, 1010], [1500, 1030], [1800, 1060], [300, 960]].map(([x, y], i) => <Tuft key={i} x={x} y={y} s={1.2} i={i} color={night ? '#5d5a32' : '#8f8a46'} />)}
      </>
    );
  }
  if (bg === 'cave-night') {
    return (
      <>
        <Shape d="M 1180 900 Q 1200 420 1470 330 Q 1760 300 1860 600 L 1900 900 Z" fill="#232a48" />
        <Stars o={1} n={30} seed={21} maxY={640} />
        <Moon x={1600} y={470} r={46} />
        <Shape d="M 0 0 L 1920 0 L 1920 900 L 1900 900 L 1860 600 Q 1760 300 1470 330 Q 1200 420 1180 900 L 0 900 Z" fill="#8f7c68" />
        <path d="M 120 200 q 80 -30 160 10 M 520 120 q 90 20 150 -10 M 300 520 q 70 -20 140 8 M 860 260 q 60 -24 130 4 M 80 700 q 60 -20 120 6"
          stroke={INK} strokeWidth={4} fill="none" opacity={0.45} />
        {[[200, 0, 70], [420, 0, 110], [760, 0, 60], [980, 0, 90]].map(([x, , h], i) => (
          <Shape key={i} d={`M ${x - 30} 0 L ${x} ${h} L ${x + 30} 0 Z`} fill="#7d6a58" sw={4} />
        ))}
        <Shape d="M 0 890 Q 600 870 1200 888 Q 1600 900 1920 886 L 1920 1080 L 0 1080 Z" fill="#6f5d4c" />
      </>
    );
  }
  if (bg === 'lab' || bg === 'lab-dark') {
    return (
      <>
        <rect x={0} y={0} width={W} height={H} fill="#dfe6ea" />
        <Shape d="M 1340 220 L 1700 220 L 1700 560 L 1340 560 Z" fill="#9cc4dc" />
        <path d="M 1520 220 L 1520 560 M 1340 390 L 1700 390" stroke={INK} strokeWidth={6} />
        <Shape d="M 0 900 L 1920 900 L 1920 1080 L 0 1080 Z" fill="#b9a68e" />
        <Shape d="M 120 360 L 380 360 L 380 900 L 120 900 Z" fill="#c9cfd4" />
        <circle cx={340} cy={640} r={10} fill={INK} />
        <Shape d="M 900 0 L 900 70 M 840 70 L 960 70 L 940 110 L 860 110 Z" fill="#ffe39a" sw={5} />
      </>
    );
  }
  if (bg === 'room-night') {
    return (
      <>
        <rect x={0} y={0} width={W} height={H} fill="#3f4670" />
        <Shape d="M 300 180 L 700 180 L 700 560 L 300 560 Z" fill="#1b2140" />
        <Moon x={520} y={320} r={50} />
        <path d="M 500 180 L 500 560 M 300 370 L 700 370" stroke={INK} strokeWidth={8} />
        <Shape d="M 0 900 L 1920 900 L 1920 1080 L 0 1080 Z" fill="#5a4a3e" />
      </>
    );
  }
  if (bg === 'town-night') {
    const lit = shot.lights ? easeOut(t(shot.lights[0], shot.lights[1])) : 0;
    const spread = shot.spread ? t(shot.spread[0], shot.spread[1]) : 0;
    const houses = [[60, 300], [380, 360], [720, 280], [1060, 340], [1400, 300], [1720, 360]];
    return (
      <>
        <NightSky seed={11} />
        {houses.map(([x, h], i) => (
          <g key={i}>
            <Shape d={`M ${x} 900 L ${x} ${900 - h} L ${x + 150} ${900 - h - 110} L ${x + 300} ${900 - h} L ${x + 300} 900 Z`} fill={i % 2 ? '#b8956a' : '#a88a66'} />
            <path d={`M ${x} ${900 - h + 60} L ${x + 300} ${900 - h + 60} M ${x + 100} ${900 - h} L ${x + 100} 900 M ${x + 200} ${900 - h} L ${x + 200} 900`}
              stroke="#4a3526" strokeWidth={6} opacity={0.7} />
            {[0, 1, 2, 3].map((w) => {
              const wx = x + 30 + (w % 2) * 170; const wy = 900 - h + 90 + Math.floor(w / 2) * 110;
              const on = (i * 4 + w) % 3 === 0 ? lit : clamp(spread * 1.3 - ((i * 4 + w) % 7) * 0.1);
              return <Shape key={w} d={`M ${wx} ${wy} L ${wx + 70} ${wy} L ${wx + 70} ${wy + 70} L ${wx} ${wy + 70} Z`} fill={on > 0.5 ? '#ffd27a' : '#2a2f45'} sw={4} />;
            })}
          </g>
        ))}
        <Shape d="M 0 900 L 1920 900 L 1920 1080 L 0 1080 Z" fill="#6a625a" />
        {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M ${i * 90} ${940 + (i % 2) * 40} q 30 -14 60 0`} stroke={INK} strokeWidth={3} fill="none" opacity={0.4} />)}
      </>
    );
  }
  if (bg === 'village-night') {
    return (
      <>
        <NightSky seed={13} />
        <Moon x={1790} y={150} r={50} />
        <Shape d="M 0 760 Q 480 730 960 750 Q 1440 770 1920 744 L 1920 1080 L 0 1080 Z" fill="#5f5a3a" />
        {[[260, 760, 0.8], [1680, 760, 0.7]].map(([x, y, s], i) => (
          <g key={i} transform={`translate(${x} ${y}) scale(${s})`}>
            <Shape d="M -150 0 L -150 -160 L 150 -160 L 150 0 Z" fill="#8a6c48" />
            <Shape d="M -190 -150 L 0 -330 L 190 -150 Z" fill="#a8884e" />
            <Shape d="M -40 0 L -40 -110 Q 0 -140 40 -110 L 40 0 Z" fill="#ffcf6a" />
          </g>
        ))}
      </>
    );
  }
  return null;   // paper, night: plain paper (night is washed dark by the caller)
};

// ------------------------------------------------------------------ the episode
const Episode: React.FC<Partial<Props>> = ({ vo = [], shots = [], intro = null, durationInSeconds = 60 }) => {
  useInkFont();
  const f = useCurrentFrame();
  const END = Math.round(durationInSeconds * 30);
  const cue = (i: number) => Math.round(((vo[i]?.start) ?? durationInSeconds) * 30);
  const lineEnd = (i: number) => (i + 1 < vo.length ? cue(i + 1) : END);
  const introEnd = intro ? cue(intro.lines) : 0;

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <InkFonts />
      {intro && f < introEnd + 10 && (
        <AbsoluteFill style={{ opacity: 1 - prog(f, introEnd - 8, introEnd + 8) }}>
          <InkPilot vo={vo.slice(0, intro.lines)} at={intro.at as never} durationInSeconds={vo[intro.lines].start} tail={false} />
        </AbsoluteFill>
      )}
      {shots.map((shot, si) => {
        const S = cue(shot.from);
        const E = si + 1 < shots.length ? cue(shots[si + 1].from) : END;
        if (f < S - 10 || f > E + 10) return null;
        const o = (si === 0 && !intro ? 1 : prog(f, S - 8, S + 8)) * (si + 1 < shots.length ? 1 - prog(f, E - 8, E + 8) : 1);
        const t = (a: number, b: number) => prog(f, lerp(S, E, a), lerp(S, E, b));
        const when = (el: El, dur = 0.12) => {
          if (el.word) {
            // appear the moment the narrator says this word (position in the line's text)
            const li = shot.from + (el.line ?? 0); const txt = (vo[li]?.text ?? '').toLowerCase();
            const k = txt.indexOf(el.word.toLowerCase());
            const fr = k < 0 ? 0 : Math.max(0, k / Math.max(1, txt.length) - 0.03);
            return prog(f, lerp(cue(li), lineEnd(li), fr), lerp(cue(li), lineEnd(li), fr) + 6);
          }
          const a = el.at ?? 0;
          if (el.line !== undefined) return prog(f, lerp(cue(shot.from + el.line), lineEnd(shot.from + el.line), a),
            lerp(cue(shot.from + el.line), lineEnd(shot.from + el.line), a + dur));
          return a <= 0 ? 1 : t(a, a + dur);
        };
        const lineT = (n: number, a: number, b: number) => prog(f, lerp(cue(shot.from + n), lineEnd(shot.from + n), a), lerp(cue(shot.from + n), lineEnd(shot.from + n), b));
        const [z0, z1] = shot.zoom ?? [1, 1.04];
        const [fx, fy] = shot.focus ?? [960, 600];
        const night = ['night', 'savanna-night', 'cave-night', 'village-night', 'town-night', 'room-night'].includes(shot.bg);
        const wash = shot.bg === 'night' ? 0.86 : shot.bg === 'lab-dark' ? 0.8 * easeInOut(t(...(shot.dark ?? [0.1, 0.3]))) :
          night ? (shot.glow ? 0.18 : 0.3) : 0;
        const fire = (shot.props ?? []).find((p) => p.k === 'fire');
        return (
          <AbsoluteFill key={si} style={{ opacity: o }}>
            <AbsoluteFill style={{ transform: `scale(${lerp(z0, z1, easeInOut(t(0, 1)))})`, transformOrigin: `${fx}px ${fy}px` }}>
              <Paper />
              <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
                <defs><Boil id={`eb${si}`} /></defs>
                <g filter={`url(#eb${si})`}>
                  <Background shot={shot} t={t} f={f} />
                  {shot.bg === 'night' && <Stars o={0.8} n={60} seed={41} maxY={1080} />}
                  {fire && shot.glow && <Glow x={fire.x} y={fire.y - 60} r={700} o={1} id={`fg${si}`} />}
                  {(shot.props ?? []).filter((p) => !['eyes', 'cateyes', 'subscribe'].includes(p.k)).map((p, i) => (
                    <PropView key={`p${i}`} p={p} t={t} when={when} f={f} />
                  ))}
                  {(shot.actors ?? []).map((a, i) => <ActorView key={`a${i}`} a={a} t={t} when={when} f={f} />)}
                </g>
              </svg>
              <Wash o={wash} />
              <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
                {(shot.props ?? []).filter((p) => ['eyes', 'cateyes', 'subscribe'].includes(p.k)).map((p, i) => (
                  <PropView key={`q${i}`} p={p} t={t} when={when} f={f} />
                ))}
              </svg>
            </AbsoluteFill>
            <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
              <defs><Boil id={`tb${si}`} scale={2} /></defs>
              <g filter={`url(#tb${si})`}>
                {(shot.tags ?? []).map((g, i) => (
                  <Tag key={i} x={g.x} y={g.y} text={g.text} o={easeOut(when(g))} rot={g.rot ?? -2} size={g.size ?? 44}
                    color={g.color === 'red' ? C.red : g.color === 'blue' ? '#3a6ab0' : INK} />
                ))}
                {shot.chapter && (
                  <g opacity={easeOut(prog(f, S + 6, S + 24))}>
                    <Tag x={40 + shot.chapter.length * 13} y={70} text={shot.chapter} o={1} rot={-1} size={30} color={C.rust} />
                  </g>
                )}
              </g>
            </svg>
            {shot.big && (() => {
              const b = shot.big; const bo = easeOut(when(b, 0.15));
              const light = b.light || (night && shot.bg !== 'room-night');
              return (
                <div style={{ position: 'absolute', top: b.y ?? 160, left: 60, right: 60, textAlign: 'center', opacity: bo,
                  transform: `scale(${0.9 + 0.1 * bo})` }}>
                  <div style={{ fontFamily: HAND, fontWeight: 700, fontSize: b.size ?? 86, lineHeight: 1.1,
                    color: light ? '#fbf4e4' : INK, textShadow: light ? '0 4px 20px #000' : 'none' }}>{b.text}</div>
                  {b.sub && <div style={{ fontFamily: HAND, fontSize: 40, marginTop: 10, color: light ? '#e8dcc0' : '#6a5a4a' }}>{b.sub}</div>}
                </div>
              );
            })()}
            {lineT(0, 0, 0) < 0 && null}
          </AbsoluteFill>
        );
      })}
    </AbsoluteFill>
  );
};

const ActorView: React.FC<{ a: ActorSpec; t: (a: number, b: number) => number; when: (el: El, d?: number) => number; f: number }> = ({ a, t, when, f }) => {
  const cast = CAST[a.who] ?? CAST.dad;
  const show = a.at || a.word ? easeOut(when(a, 0.1)) : 1;
  if (show <= 0.001) return null;
  const mv = a.to && a.move ? easeInOut(t(a.move[0], a.move[1])) : 0;
  const x = a.to ? lerp(a.x, a.to[0], mv) : a.x;
  const y = a.to ? lerp(a.y, a.to[1], mv) : a.y;
  const moving = !!(a.to && a.move && t(a.move[0], a.move[1]) > 0 && t(a.move[0], a.move[1]) < 1);
  const after = a.then && t(a.then.at, a.then.at + 0.001) >= 1;
  let mood: Mood = (after && a.then?.mood) || a.mood || 'neutral';
  const poseName = (after && a.then?.pose) || a.pose || 'stand';
  const base = POSES[poseName] ?? POSES.stand;
  const pose: Pose = moving || poseName === 'walk' ? { ...base, ll: 18 * Math.sin(f / 4), rl: -18 * Math.sin(f / 4) } : base;
  if (a.talk && t(a.talk[0], a.talk[1]) > 0 && t(a.talk[0], a.talk[1]) < 1) mood = Math.floor(f / 5) % 2 ? 'wow' : 'happy';
  const s = (a.s ?? 1) * (cast.s ?? 1);
  const blink = (f + x) % 97 < 4 || mood === 'sleepy';
  const person = (px: number, py: number) => (
    <Person x={px} y={py} s={s} skin={cast.skin} tunic={cast.tunic} hair={cast.hair} hairColor={cast.hairColor} outfit={cast.outfit}
      glasses={cast.glasses} brow={cast.brow} mood={mood} pose={pose} look={a.look ?? 0} flip={a.flip} blink={blink && mood === 'sleepy' ? true : blink}
      hand={poseName === 'write' ? <path d="M 0 0 L 26 -40" stroke={INK} strokeWidth={5} /> :
        poseName === 'drink' ? <Shape d="M -14 -10 L 14 -10 L 10 18 L -10 18 Z" fill="#fbf4e4" sw={3} /> :
          poseName === 'sneak' ? <Shape d="M -30 0 Q -40 60 0 64 Q 40 60 30 0 Z" fill="#a88a5a" sw={4} /> : undefined}
      carry={poseName === 'play' ? <Shape d="M -70 -6 L 70 -14 L 70 -4 L -70 4 Z" fill="#e8dcbc" sw={3} /> : undefined} />
  );
  const seated = !a.lie && pose.sit && poseName !== 'sitbed';
  return (
    <g opacity={(a.ghost ? 0.45 : 1) * show}>
      {seated && <Shape d={`M ${x - 50 * s} ${y} L ${x - 54 * s} ${y - 60 * s} Q ${x + 20 * s} ${y - 72 * s} ${x + 100 * s} ${y - 60 * s} L ${x + 104 * s} ${y} Z`}
        fill={['hominin', 'hominin2', 'dad', 'mom', 'kid', 'elder'].includes(a.who) ? C.rock : '#7a5638'} />}
      {a.lie ? (
        <g transform={`translate(${x + 170 * s} ${y}) rotate(-90)`}>{person(0, 0)}</g>
      ) : person(x, y)}
      {a.phone && <Glow x={x - 120 * s} y={y - 60 * s} r={160 * s} o={0.9 + 0.1 * Math.sin(f / 3)} id={`ph${Math.round(x)}`} color="#7fb8ff" />}
    </g>
  );
};

const PropView: React.FC<{ p: PropSpec; t: (a: number, b: number) => number; when: (el: El, d?: number) => number; f: number }> = ({ p, t, when, f }) => {
  const show = p.word || (p.at !== undefined && p.at > 0) ? easeOut(when(p, 0.1)) : p.at !== undefined && p.line !== undefined ? easeOut(when(p, 0.1)) : 1;
  if (show <= 0.001) return null;
  const s = p.s ?? 1;
  const win = (key: string) => (p[key] as [number, number] | undefined);
  const grow = win('grow');
  let node: React.ReactNode = null;
  switch (p.k) {
    case 'fire': {
      const lo = (p.min as number) ?? 0; const hi = (p.max as number) ?? 1;
      const g = grow ? (grow[0] < 0 ? 1 : easeOut(t(grow[0], grow[1]))) : 1;
      node = <Fire x={p.x} y={p.y} s={s} t={lerp(lo, hi, g)} />;
      break;
    }
    case 'mound': node = <Mound x={p.x} y={p.y} w={420 * s} h={70 * s} />; break;
    case 'eyes': {
      const fd = win('fade'); const fo = fd ? 1 - t(fd[0], fd[1]) : 1;
      node = <Eyes x={p.x - (fd ? 240 * t(fd[0], fd[1]) : 0)} y={p.y} o={fo} i={Math.round(p.x)} />;
      break;
    }
    case 'cat': {
      const mv = p.move ? easeInOut(t((p.move as number[])[0], (p.move as number[])[1])) : 0;
      const to = p.to as number[] | undefined;
      node = <BigCat x={to ? lerp(p.x, to[0], mv) : p.x} y={to ? lerp(p.y, to[1], mv) : p.y} s={s} sabre={!!p.sabre} still={!!p.still} flip={!!p.flip} />;
      break;
    }
    case 'cateyes': node = <CatEyes x={p.x} y={p.y} o={show} />; break;
    case 'bones': node = <Bones x={p.x} y={p.y} s={s} burnt={!!p.burnt} />; break;
    case 'sleepbar': {
      const g = grow ? (grow[0] < 0 ? 1 : easeInOut(t(grow[0], grow[1]))) : 1;
      const fd = win('fade'); const sq = win('squeeze');
      node = <SleepBar x={p.x} y={p.y} blocks={p.blocks as [string, number][]} t={g} labels={!!p.labels}
        o={fd ? 1 - 0.75 * t(fd[0], fd[1]) : 1} squeeze={sq ? easeInOut(t(sq[0], sq[1])) : 0} />;
      break;
    }
    case 'clock': node = <Clock x={p.x} y={p.y} s={s} dark={p.dark as number | undefined} time={p.time as number | undefined} />; break;
    case 'calendar': {
      const flip = p.flip as string[] | undefined;
      const text = flip ? flip[Math.min(flip.length - 1, Math.floor(t(0, 0.7) * flip.length))] : (p.text as string);
      node = <Calendar x={p.x} y={p.y} s={s} text={text} />;
      break;
    }
    case 'bed': node = <Bed x={p.x} y={p.y} s={s} />; break;
    case 'zzz': node = <Zzz x={p.x} y={p.y} />; break;
    case 'question': {
      const from = p.from as [number, number];
      node = <Bubble x={p.x} y={p.y} w={200} h={150} o={show} from={from}>
        <text x={p.x} y={p.y + 36} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={110} fill={INK}>?</text></Bubble>;
      break;
    }
    case 'think': {
      const from = p.from as [number, number];
      node = <Bubble x={p.x} y={p.y} w={240} h={150} o={show} from={from}>
        <text x={p.x} y={p.y + 20} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={80} fill={INK}>...</text></Bubble>;
      break;
    }
    case 'dream': {
      const from = p.from as [number, number];
      node = <Bubble x={p.x} y={p.y} w={360} h={220} o={show} from={from}><DreamIcons x={p.x - 20} y={p.y + 10} /></Bubble>;
      break;
    }
    case 'speech': {
      const from = p.from as [number, number];
      node = <Bubble x={p.x} y={p.y} w={260} h={180} o={show} from={from}><SpeechIcon x={p.x} y={p.y} kind={p.icon as string} /></Bubble>;
      break;
    }
    case 'book': node = <Book x={p.x} y={p.y} s={s} />; break;
    case 'candle': node = <Candle x={p.x} y={p.y} s={s} />; break;
    case 'desk': node = <Desk x={p.x} y={p.y} s={s} />; break;
    case 'hut': node = <Hut x={p.x} y={p.y} s={s} />; break;
    case 'magnifier': node = <Magnifier x={p.x} y={p.y} />; break;
    case 'clue': node = <ClueCard x={p.x} y={p.y} text={p.text as string} o={show} />; break;
    case 'flute': {
      const h = win('holes');
      node = <Flute x={p.x} y={p.y} s={s} holes={h ? t(h[0], h[1]) : 0} />;
      break;
    }
    case 'notes': node = <Notes x={p.x} y={p.y} o={show} />; break;
    case 'notchbone': {
      const cv = win('carve');
      const n = cv ? (cv[0] < 0 ? 29 : 29 * t(cv[0], cv[1])) : 29;
      node = <NotchBone x={p.x} y={p.y} s={s} n={n} count={!!p.count} />;
      break;
    }
    case 'moonrow': node = <MoonRow x={p.x} y={p.y} o={show} />; break;
    case 'rock': node = <Rock x={p.x} y={p.y} s={s} />; break;
    case 'moon': node = <Moon x={p.x} y={p.y} r={50 * s} />; break;
    case 'streetlamp': node = <StreetLamp x={p.x} y={p.y} on={easeOut(t(p.light as number, (p.light as number) + 0.08))} />; break;
    case 'clipboard': node = <Clipboard x={p.x} y={p.y} s={s} />; break;
    case 'subscribe': node = <Subscribe x={p.x} y={p.y} o={show} />; break;
    case 'svg': {
      // a drawing written by the episode's author (Gemini) for things the library lacks;
      // drawn in a 400x400 box centred on (x, y). Scripts, handlers and links stripped.
      const safe = String(p.svg ?? '').replace(/<script[\s\S]*?<\/script>/gi, '').replace(/\son\w+="[^"]*"/gi, '')
        .replace(/(href|xlink:href)="(?!#)[^"]*"/gi, '').replace(/<\/?svg[^>]*>/gi, '');
      const pop = 0.85 + 0.15 * show;
      node = <g transform={`translate(${p.x - 200 * s * pop} ${p.y - 200 * s * pop}) scale(${s * pop})`} dangerouslySetInnerHTML={{ __html: safe }} />;
      break;
    }
    default: node = null;
  }
  return <g opacity={(p.ghost ? 0.45 : 1) * (['question', 'think', 'dream', 'speech', 'clue', 'notes', 'moonrow', 'cateyes', 'subscribe'].includes(p.k) ? 1 : show)}>{node}</g>;
};

// little pictures for speech bubbles: a warning (big cat), a hunting tip (spear), who to trust (two faces)
const SpeechIcon: React.FC<{ x: number; y: number; kind: string }> = ({ x, y, kind }) => {
  if (kind === 'cat') return (
    <g transform={`translate(${x} ${y})`}>
      <Shape d="M -50 20 Q -54 -30 -10 -36 Q 40 -40 50 0 Q 54 30 20 40 Q -40 46 -50 20 Z" fill="#d9a14e" sw={4} />
      <Shape d="M -40 -26 L -34 -60 L -12 -36 Z M 18 -38 L 34 -64 L 42 -28 Z" fill="#d9a14e" sw={4} />
      <circle cx={-16} cy={-6} r={6} fill={INK} /><circle cx={20} cy={-6} r={6} fill={INK} />
      <path d="M -4 14 L 4 14 L 0 20 Z M -20 28 l 6 12 M 20 28 l -6 12" stroke={INK} strokeWidth={4} fill={INK} />
      <text x={70} y={-30} fontFamily={HAND} fontWeight={700} fontSize={56} fill={C.red}>!</text>
    </g>
  );
  if (kind === 'spear') return (
    <g transform={`translate(${x} ${y}) rotate(-30)`}>
      <line x1={-90} y1={0} x2={70} y2={0} stroke={INK} strokeWidth={14} strokeLinecap="round" />
      <line x1={-90} y1={0} x2={70} y2={0} stroke="#8a5a3a" strokeWidth={7} strokeLinecap="round" />
      <Shape d="M 66 -16 L 110 0 L 66 16 Z" fill="#9aa3ad" sw={4} />
    </g>
  );
  return (
    <g transform={`translate(${x} ${y})`}>
      {[-36, 36].map((dx, i) => (
        <g key={dx}>
          <Shape d={`M ${dx - 28} 10 Q ${dx - 30} -40 ${dx} -40 Q ${dx + 30} -40 ${dx + 28} 10 Q ${dx} 34 ${dx - 28} 10 Z`} fill={i ? C.skin1 : C.skin2} sw={4} />
          <circle cx={dx - 9} cy={-12} r={4} fill={INK} /><circle cx={dx + 9} cy={-12} r={4} fill={INK} />
          <path d={`M ${dx - 10} 6 Q ${dx} 14 ${dx + 10} 6`} stroke={INK} strokeWidth={3.5} fill="none" />
        </g>
      ))}
      <text x={0} y={-56} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={40} fill={C.red}>?</text>
    </g>
  );
};

export default Episode;
