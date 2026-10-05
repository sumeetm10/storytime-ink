import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import {
  Acacia, Boil, Bubble, C, Cross, Eyes, Fire, Glow, H, HAND, INK, InkFonts, useInkFont, Leaf, Moon, Mosquito, Person, Shape, Stars, Tag, Tuft, W,
  clamp, easeInOut, easeOut, lerp, prog, rng,
} from './kit';

// =============================================================================
// Pilot: the opening of "What did ancient humans do when they couldn't sleep?"
// for Story_time10, 1920x1080. Scenes: a savanna sunset going dark (no lamp, no
// phone, no roof, eyes in the grass); the title; fire lighting up the family
// (warmth, light, safety); a timeline back 1.8 million years; a cave where a
// grass bed is made (Border Cave, 200,000 years) and topped with insect-killing
// leaves (Sibudu, 77,000 years); one long sleep vs two shifts with an hour awake
// at midnight; and the cliffhanger. Script + sources: pilot_sleep.py.
// =============================================================================
type VoLine = { text: string; start: number; end: number };
type Props = {
  vo: VoLine[];
  at: { dark: number; nothing: number; title: number; fire: number; gifts: number; old: number; grass: number; bugs: number;
    strange: number; shifts: number; cliff: number };
  durationInSeconds: number;
  tail?: boolean;          // the TO BE CONTINUED card (off inside a full episode)
};

const Paper: React.FC<{ night?: number }> = ({ night = 0 }) => (
  <>
    <Img src={staticFile('ink/paper.jpg')} style={{ position: 'absolute', width: W, height: H }} />
    {night > 0 && <AbsoluteFill style={{ background: '#1d2342', mixBlendMode: 'multiply', opacity: night }} />}
  </>
);

const Svg: React.FC<{ id: string; children: React.ReactNode; boil?: number }> = ({ id, children, boil = 3.4 }) => (
  <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
    <defs><Boil id={id} scale={boil} /></defs>
    <g filter={`url(#${id})`}>{children}</g>
  </svg>
);

const Card: React.FC<{ x: number; y: number; o: number; children: React.ReactNode }> = ({ x, y, o, children }) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${0.8 + 0.2 * o})`}>
    <rect x={-90 + 6} y={-90 + 5} width={180} height={180} rx={18} fill="#00000033" />
    <Shape d="M -90 -80 Q -90 -90 -80 -90 L 80 -90 Q 90 -90 90 -80 L 90 80 Q 90 90 80 90 L -80 90 Q -90 90 -90 80 Z" fill="#fbf4e4" />
    {children}
  </g>
);

const Mound: React.FC<{ x: number; y: number; w: number; h: number; seed?: number }> = ({ x, y, w, h, seed = 3 }) => {
  if (h < 2) return null;
  const r = rng(seed);
  return (
    <g>
      <Shape d={`M ${x - w / 2} ${y} Q ${x - w / 2} ${y - h} ${x} ${y - h} Q ${x + w / 2} ${y - h} ${x + w / 2} ${y} Z`} fill="#c9b25e" />
      {Array.from({ length: 34 }, (_, i) => {
        const u = r() - 0.5; const v = r();
        const px = x + u * w * 0.9; const top = y - h * Math.sqrt(Math.max(0, 1 - (2 * u) ** 2)) * 0.95;
        const py = lerp(top + 6, y - 4, v * 0.8);
        return <line key={i} x1={px} y1={py} x2={px + (r() - 0.5) * 40} y2={py - 4 - r() * 8} stroke="#7d6a2e" strokeWidth={3} strokeLinecap="round" />;
      })}
    </g>
  );
};

const Zzz: React.FC<{ x: number; y: number; f: number; o?: number }> = ({ x, y, f, o = 1 }) => (
  <g opacity={o}>
    {[0, 1, 2].map((i) => {
      const k = ((f / 40 + i / 3) % 1);
      return <text key={i} x={x + k * 60} y={y - k * 110} fontFamily={HAND} fontWeight={700} fontSize={28 + k * 26} fill={INK} opacity={Math.sin(k * Math.PI)}>z</text>;
    })}
  </g>
);

const InkPilot: React.FC<Partial<Props>> = ({ vo = [], at, durationInSeconds = 70, tail: tailOn = true }) => {
  useInkFont();
  const f = useCurrentFrame();
  if (!at) return <AbsoluteFill style={{ background: C.paper }} />;
  const END = Math.round(durationInSeconds * 30);
  const cue = (i: number) => Math.round(((vo[i]?.start) ?? durationInSeconds) * 30);
  const lineEnd = (i: number) => (i + 1 < vo.length ? cue(i + 1) : END);
  const within = (i: number, a: number, b: number) => prog(f, lerp(cue(i), lineEnd(i), a), lerp(cue(i), lineEnd(i), b));
  const span = (a: number, b: number) => (a === 0 ? 1 : prog(f, cue(a) - 8, cue(a) + 8)) * (1 - prog(f, cue(b) - 8, cue(b) + 8));
  const blinkAt = (seed: number) => (f + seed * 41) % 97 < 4;
  const push = (a: number, b: number, k = 0.05) => 1 + k * prog(f, cue(a), b === -1 ? END : cue(b));

  // ---------------------------------------------------------------- savanna
  const sSav = span(0, at.title);
  const sun = easeInOut(prog(f, cue(0), lerp(cue(at.dark), lineEnd(at.dark), 0.5)));
  const night = easeInOut(within(at.dark, 0.15, 0.75));
  const eyesO = easeOut(within(at.nothing, 0.55, 0.8));
  const scared = f >= lerp(cue(at.nothing), lineEnd(at.nothing), 0.6);

  // ---------------------------------------------------------------- fire
  const sFire = span(at.fire, at.old);
  const lit = easeOut(within(at.fire, 0.25, 0.75));
  const tagT = (a: number) => easeOut(within(at.gifts, a, a + 0.12));

  // ---------------------------------------------------------------- timeline
  const sOld = span(at.old, at.grass);
  const back = easeInOut(within(at.old, 0.25, 0.8));
  const tx = (yrs: number) => 1700 - ((Math.log10(Math.max(1000, yrs)) - 3) / (Math.log10(1.8e6) - 3)) * 1420;
  const yrsNow = Math.pow(10, 3 + back * (Math.log10(1.8e6) - 3));
  const yrsText = back < 0.02 ? 'TODAY' : yrsNow >= 1e6 ? `${(yrsNow / 1e6).toFixed(1)} MILLION YEARS AGO`
    : `${(Math.round(yrsNow / 1000) * 1000).toLocaleString('en-US')} YEARS AGO`;

  // ---------------------------------------------------------------- cave
  const sCave = span(at.grass, at.strange);
  const walk = easeInOut(within(at.grass, 0, 0.3));
  const bed = easeInOut(within(at.grass, 0.28, 0.85));
  const zoom = easeInOut(within(at.bugs, 0, 0.25));
  const leaves = within(at.bugs, 0.08, 0.4);
  const bugIn = within(at.bugs, 0.3, 0.6); const bugOut = within(at.bugs, 0.6, 0.85);

  // ---------------------------------------------------------------- two shifts
  const sShift = span(at.strange, at.cliff);
  const today = easeInOut(within(at.strange, 0.3, 0.8));
  const sp = (() => {
    const a = within(at.shifts, 0.33, 0.5); const b = within(at.shifts, 0.5, 0.78); const c = within(at.shifts, 0.78, 0.97);
    return c > 0 ? lerp(0.54, 1, c) : b > 0 ? lerp(0.46, 0.54, b) : lerp(0, 0.46, a);
  })();
  const awake = sp > 0.46 && sp < 0.56;

  // ---------------------------------------------------------------- cliffhanger
  const sCliff = span(at.cliff, -1);
  const tail = tailOn ? prog(f, END - 34, END - 12) : 0;

  return (
    <AbsoluteFill style={{ background: C.paper, overflow: 'hidden' }}>
      <InkFonts />
      {/* ================= savanna: sunset, dark, nothing, eyes ================= */}
      {sSav > 0.001 && (
        <AbsoluteFill style={{ opacity: sSav, transform: `scale(${push(0, at.title)})` }}>
          <Paper />
          <Svg id="b-sav">
            <defs>
              <linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#9fb7d0" /><stop offset="0.75" stopColor="#f2b98a" /><stop offset="1" stopColor="#f6d39a" />
              </linearGradient>
              <linearGradient id="nite" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1b2140" /><stop offset="1" stopColor="#3a3f66" />
              </linearGradient>
            </defs>
            <rect x={0} y={0} width={W} height={720} fill="url(#dusk)" opacity={0.92} />
            <rect x={0} y={0} width={W} height={720} fill="url(#nite)" opacity={night} />
            <Stars o={night} n={90} maxY={640} />
            <Shape d={`M ${1250 - 90} ${lerp(560, 800, sun)} a 90 90 0 1 0 180 0 a 90 90 0 1 0 -180 0`} fill="#f4a24a" />
            <Shape d="M 0 720 Q 300 690 620 712 Q 980 734 1320 700 Q 1640 676 1920 708 L 1920 1080 L 0 1080 Z" fill={C.grass} />
            <Acacia x={1560} y={735} s={1.05} />
            <g transform="translate(780 900) scale(1.45) translate(-780 -900)">
            <Shape d="M 590 860 Q 600 790 700 786 Q 830 782 860 840 Q 870 872 840 880 L 610 884 Q 584 880 590 860 Z" fill={C.rock} />
            <Person x={660} y={900} skin={C.skin2} tunic={C.rust} hair="beard" pose={{ sit: true, la: 30, lb: -50, ra: 20, rb: -40 }}
              mood={scared ? 'scared' : night > 0.6 ? 'worried' : 'neutral'} look={scared ? -1 : 1} blink={blinkAt(1)} />
            <Person x={790} y={900} skin={C.skin1} tunic={C.ochre} hair="bun" pose={{ sit: true, la: 26, lb: -60, ra: scared ? 70 : 16, rb: scared ? -20 : -30 }}
              mood={scared ? 'scared' : 'neutral'} look={scared ? 1 : 1} blink={blinkAt(2)} />
            <Person x={lerp(960, 900, scared ? easeOut(within(at.nothing, 0.6, 0.8)) : 0)} y={950} s={0.7} skin={C.skin3} tunic={C.sage} hair="kid"
              pose={{ la: 20, ra: scared ? 140 : 20, rb: scared ? 20 : 0 }} mood={scared ? 'scared' : night > 0.5 ? 'worried' : 'happy'}
              look={night > 0.5 ? 1 : 1} blink={blinkAt(3)} />
            </g>
            {[[120, 1010], [430, 980], [1060, 1000], [1320, 990], [1760, 1020], [260, 930], [1500, 950]].map(([x, y], i) => (
              <Tuft key={i} x={x} y={y} s={1.3} i={i} />
            ))}
          </Svg>
          <AbsoluteFill style={{ background: '#121630', mixBlendMode: 'multiply', opacity: night * 0.4 }} />
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            {[[300, 820, 0], [1290, 800, 1], [1720, 870, 2], [120, 900, 3]].map(([x, y, i]) => (
              <Eyes key={i} x={x} y={y} o={eyesO * (i < 2 ? 1 : prog(f, cue(at.nothing) + 20 * i, cue(at.nothing) + 20 * i + 1) > 0 ? 1 : 0)} i={i} />
            ))}
          </svg>
          {f >= cue(at.nothing) && (
            <Svg id="b-icons" boil={2.2}>
              {[0, 1, 2].map((k) => {
                const pop = easeOut(within(at.nothing, k * 0.11, k * 0.11 + 0.06));
                const x = 660 + k * 300;
                return (
                  <g key={k}>
                    <Card x={x} y={230} o={pop}>
                      {k === 0 && <g><Shape d="M -40 -10 L -26 -60 L 26 -60 L 40 -10 Z" fill={C.ochre} /><Shape d="M 0 -10 L 0 40 M -30 44 L 30 44" sw={7} />
                        <path d="M -60 -70 l -14 -14 M 60 -70 l 14 -14 M 0 -78 l 0 -16" stroke={INK} strokeWidth={4} /></g>}
                      {k === 1 && <g><Shape d="M -30 -60 Q -30 -68 -22 -68 L 22 -68 Q 30 -68 30 -60 L 30 60 Q 30 68 22 68 L -22 68 Q -30 68 -30 60 Z" fill="#3a4357" />
                        <rect x={-22} y={-54} width={44} height={96} rx={4} fill={C.sky} /><circle cx={0} cy={56} r={5} fill="#fbf4e4" /></g>}
                      {k === 2 && <g><Shape d="M -60 0 L 0 -55 L 60 0 Z" fill={C.rust} /><Shape d="M -46 0 L -46 55 L 46 55 L 46 0" fill="#e8d6b0" />
                        <rect x={-12} y={20} width={24} height={35} fill={INK} /></g>}
                    </Card>
                    <Cross x={x} y={230} r={70} t={within(at.nothing, k * 0.11 + 0.05, k * 0.11 + 0.12)} />
                  </g>
                );
              })}
            </Svg>
          )}
        </AbsoluteFill>
      )}

      {/* ================= title ================= */}
      {span(at.title, at.fire) > 0.001 && (
        <AbsoluteFill style={{ opacity: span(at.title, at.fire), transform: `scale(${push(at.title, at.fire, 0.04)})` }}>
          <Paper />
          <Svg id="b-title">
            <defs>
              {[0, 1, 2].map((i) => (
                <clipPath key={i} id={`wr${i}`}><rect x={0} y={0} width={W * easeInOut(within(at.title, i * 0.18, i * 0.18 + 0.3))} height={H} /></clipPath>
              ))}
            </defs>
            <Moon x={1660} y={700} r={70} />
            <Stars o={0.0} />
            <text x={960} y={210} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={88} fill={INK} clipPath="url(#wr0)">WHAT DID ANCIENT HUMANS DO</text>
            <text x={960} y={330} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={88} fill={INK} clipPath="url(#wr1)">WHEN THEY COULDN'T</text>
            <text x={960} y={490} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={150} fill={C.rust} clipPath="url(#wr2)">SLEEP?</text>
            <g transform="translate(960 930) scale(1.35) translate(-960 -930)">
            <Mound x={960} y={930} w={520} h={70} seed={9} />
            <g transform="translate(1150 905) rotate(-90)">
              <Person x={0} y={0} skin={C.skin1} tunic={C.ochre} hair="bun" mood="worried" blink={blinkAt(4)} look={-1} pose={{ la: 10, ra: 10 }} />
            </g>
            </g>
            <Bubble x={1260} y={640} w={150} h={110} o={easeOut(within(at.title, 0.6, 0.8))} from={[1000, 760]}>
              <text x={1260} y={672} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={90} fill={INK}>?</text>
            </Bubble>
          </Svg>
        </AbsoluteFill>
      )}

      {/* ================= fire: warmth, light, safety ================= */}
      {sFire > 0.001 && (
        <AbsoluteFill style={{ opacity: sFire, transform: `scale(${push(at.fire, at.old, 0.05)})` }}>
          <Paper />
          <AbsoluteFill style={{ background: '#1d2342', mixBlendMode: 'multiply', opacity: lerp(0.82, 0.5, lit) }} />
          <Svg id="b-fire">
            <Stars o={1 - lit * 0.6} n={70} maxY={560} seed={11} />
            <Shape d="M 0 760 Q 480 740 960 756 Q 1440 772 1920 748 L 1920 1080 L 0 1080 Z" fill="#6f6a3e" />
            <Glow x={960} y={830} r={760 * lit} o={1} id="fireglow" />
            <g transform="translate(960 940) scale(1.3) translate(-960 -940)">
            <Shape d="M 560 900 L 760 890 L 762 924 L 562 932 Z" fill="#6a4a30" />
            <Shape d="M 1160 892 L 1360 902 L 1358 934 L 1158 926 Z" fill="#6a4a30" />
            <Person x={640} y={960} skin={C.skin2} tunic={C.rust} hair="beard" pose={{ sit: true, la: 40, lb: -70, ra: 70, rb: -50 }}
              mood={lit > 0.5 ? 'happy' : 'scared'} look={1} blink={blinkAt(5)} />
            <Person x={1280} y={960} flip skin={C.skin1} tunic={C.ochre} hair="bun" pose={{ sit: true, la: 60, lb: -40, ra: 40, rb: -70 }}
              mood={lit > 0.5 ? 'happy' : 'worried'} look={1} blink={blinkAt(6)} />
            <Person x={1080} y={900} s={0.66} skin={C.skin3} tunic={C.sage} hair="kid" pose={{ la: 40, ra: 120, rb: 20 }}
              mood={lit > 0.6 ? 'wow' : 'worried'} look={-1} blink={blinkAt(7)} />
            <Fire x={960} y={900} s={1.1} t={lit} />
            </g>
            {/* the gifts of fire */}
            <g opacity={tagT(0.05)} stroke={C.fire} strokeWidth={6} fill="none" strokeLinecap="round">
              {[-40, 0, 40].map((dx) => <path key={dx} d={`M ${960 + dx} 620 q 14 -20 0 -40 q -14 -20 0 -40`} />)}
            </g>
            <g opacity={tagT(0.22)} stroke={C.ember} strokeWidth={6} strokeLinecap="round">
              {Array.from({ length: 10 }, (_, i) => {
                const a = Math.PI * (1.2 + (i / 9) * 0.6); const r1 = 300 + 10 * Math.sin(f / 6 + i); const r2 = r1 + 60;
                return <line key={i} x1={960 + Math.cos(a) * r1} y1={830 + Math.sin(a) * r1} x2={960 + Math.cos(a) * r2} y2={830 + Math.sin(a) * r2} />;
              })}
            </g>
            <Tag x={520} y={330} text="WARMTH" o={tagT(0.05)} rot={-5} />
            <Tag x={960} y={210} text="LIGHT" o={tagT(0.22)} rot={2} />
            <Tag x={1400} y={330} text="SAFETY FROM PREDATORS" o={tagT(0.48)} rot={4} size={40} />
          </Svg>
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            {[[250, 800, 0], [1680, 790, 1], [1500, 860, 2]].map(([x, y, i]) => (
              <Eyes key={i} x={x + (x < 960 ? -1 : 1) * 300 * lit} y={y} o={1 - lit} i={i} />
            ))}
          </svg>
        </AbsoluteFill>
      )}

      {/* ================= 1.8 million years ================= */}
      {sOld > 0.001 && (
        <AbsoluteFill style={{ opacity: sOld }}>
          <Paper />
          <Svg id="b-old">
            <Shape d="M 230 600 L 1720 600" sw={7} />
            {[[1000, 'TODAY'], [1e4, '10,000'], [1e5, '100,000'], [1e6, '1 MILLION'], [1.8e6, '1.8 MILLION']].map(([y, l]) => {
              const x = y === 1000 ? 1700 : tx(Number(y));
              return (
                <g key={String(l)}>
                  <line x1={x} y1={580} x2={x} y2={620} stroke={INK} strokeWidth={5} />
                  <text x={x} y={y === 1.8e6 ? 556 : 670} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={34}
                    fill={y === 1.8e6 ? C.rust : INK}>{l}</text>
                </g>
              );
            })}
            <text x={1700} y={712} textAnchor="middle" fontFamily={HAND} fontSize={26} fill="#6a5a4a">years ago</text>
            <Fire x={lerp(1700, 280, back)} y={back > 0.95 ? 500 : 560} s={0.32} t={1} />
            <g opacity={easeOut(within(at.old, 0.78, 0.95))}>
              <Mound x={420} y={1000} w={0} h={0} />
              <Person x={470} y={1010} s={0.8} skin={C.skin3} tunic={C.rust} hair="shaggy" mood="happy" pose={{ la: 60, lb: -30, ra: 20 }} blink={blinkAt(8)} look={-1} />
              <Fire x={300} y={990} s={0.5} t={1} />
              <Tag x={980} y={940} text="WONDERWERK CAVE · SOUTH AFRICA" o={1} size={38} rot={-2} />
            </g>
          </Svg>
          <div style={{ position: 'absolute', top: 150, left: 0, right: 0, textAlign: 'center', fontFamily: HAND, fontWeight: 700,
            fontSize: 96, color: back > 0.97 ? C.rust : INK }}>{back > 0.97 ? '1.8 MILLION YEARS' : yrsText}</div>
          <div style={{ position: 'absolute', top: 290, left: 0, right: 0, textAlign: 'center', fontFamily: HAND, fontSize: 40, color: '#6a5a4a',
            opacity: easeOut(within(at.old, 0.1, 0.3)) }}>oldest signs of humans using fire</div>
        </AbsoluteFill>
      )}

      {/* ================= the cave: a grass bed, then a bug-proof one ================= */}
      {sCave > 0.001 && (
        <AbsoluteFill style={{ opacity: sCave }}>
          <AbsoluteFill style={{ transform: `scale(${lerp(1, 1.55, zoom)})`, transformOrigin: '900px 760px' }}>
            <Paper />
            <Svg id="b-cave">
              {/* the cave mouth: night outside */}
              <Shape d="M 1180 880 Q 1200 420 1470 330 Q 1760 300 1860 600 L 1900 880 Z" fill="#232a48" />
              <Stars o={1} n={30} seed={21} maxY={640} />
              <Moon x={1600} y={470} r={46} />
              {/* rock all around */}
              <Shape d="M 0 0 L 1920 0 L 1920 880 L 1900 880 L 1860 600 Q 1760 300 1470 330 Q 1200 420 1180 880 L 0 880 Z" fill="#9a8672" />
              <path d="M 120 200 q 80 -30 160 10 M 520 120 q 90 20 150 -10 M 300 520 q 70 -20 140 8 M 860 260 q 60 -24 130 4" stroke={INK} strokeWidth={4} fill="none" opacity={0.45} />
              <Shape d="M 0 870 Q 600 850 1200 868 Q 1600 880 1920 866 L 1920 1080 L 0 1080 Z" fill="#7d6a58" />
              <Glow x={360} y={840} r={420} o={1} id="caveglow" />
              <Fire x={360} y={900} s={0.6} t={1} />
              <g transform="translate(1000 920) scale(1.35) translate(-1000 -920)">
              <Mound x={900} y={900} w={420} h={90 * bed} seed={5} />
              {f < cue(at.bugs) && (
                <Person x={lerp(1500, 1110, walk)} y={940} flip skin={C.skin1} tunic={C.ochre} hair="bun"
                  pose={{ la: walk < 1 ? 70 : 30, lb: -40, ra: walk < 1 ? 70 : 30, rb: -40,
                    ll: walk < 1 ? 14 * Math.sin(f / 4) : 6, rl: walk < 1 ? -14 * Math.sin(f / 4) : 6 }}
                  mood="happy" look={1} blink={blinkAt(9)}
                  carry={bed < 0.5 ? <g transform="translate(0 -10)"><Shape d="M -60 -20 Q 0 -60 60 -20 L 50 20 Q 0 0 -50 20 Z" fill="#c9b25e" sw={4} /></g> : undefined} />
              )}
              {f >= cue(at.bugs) && (
                <>
                  {Array.from({ length: 9 }, (_, i) => {
                    const t = easeOut(clamp(leaves * 1.6 - i * 0.07));
                    const tx2 = 720 + i * 44; const ty = 836 + Math.sin(i * 2.1) * 10;
                    return t > 0 ? <Leaf key={i} x={tx2} y={lerp(560, ty, t)} r={i * 37 - 40 + (1 - t) * 90} s={0.9} /> : null;
                  })}
                  <g transform="translate(1080 862) rotate(-90)">
                    <Person x={0} y={0} s={0.82} skin={C.skin2} tunic={C.rust} hair="beard" mood="sleepy" blink pose={{ la: 8, ra: 8 }} />
                  </g>
                  {[0, 1, 2].map((i) => {
                    const x0 = 1460 + i * 60; const y0 = 600 + i * 60;
                    const tx3 = 1000 + i * 30; const ty3 = 760 + i * 20;
                    const x = bugOut > 0 ? lerp(tx3, x0 + 200, easeOut(bugOut)) : lerp(x0, tx3, easeInOut(bugIn));
                    const y = (bugOut > 0 ? lerp(ty3, y0 - 120, easeOut(bugOut)) : lerp(y0, ty3, easeInOut(bugIn))) + Math.sin(f / 3 + i) * 8;
                    return (bugIn > 0 ? <g key={i}><Mosquito x={x} y={y} s={1.2} flip={bugOut > 0} />
                      {bugOut > 0 && bugOut < 0.6 && <text x={x} y={y - 34} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={36} fill={C.red}>!</text>}</g> : null);
                  })}
                  <Zzz x={900} y={760} f={f} />
                </>
              )}
              </g>
            </Svg>
          </AbsoluteFill>
          <svg width={W} height={H} style={{ position: 'absolute', inset: 0 }}>
            <Tag x={960} y={150} text="BORDER CAVE · SOUTH AFRICA" o={easeOut(within(at.grass, 0.3, 0.45)) * (f < cue(at.bugs) ? 1 : 0)} size={42} />
            <Tag x={960} y={260} text="200,000 YEARS AGO" o={easeOut(within(at.grass, 0.68, 0.82)) * (f < cue(at.bugs) ? 1 : 0)} rot={3} size={40} />
            <Tag x={960} y={150} text="SIBUDU CAVE" o={easeOut(within(at.bugs, 0.06, 0.18))} size={42} />
            <Tag x={1380} y={480} text="BUG-PROOF MATTRESS" o={easeOut(within(at.bugs, 0.7, 0.8))} rot={-8} size={44} color={C.red} />
            <Tag x={1460} y={300} text="77,000 YEARS AGO" o={easeOut(within(at.bugs, 0.8, 0.9))} rot={2} size={40} />
          </svg>
        </AbsoluteFill>
      )}

      {/* ================= one long sleep vs two shifts ================= */}
      {sShift > 0.001 && (
        <AbsoluteFill style={{ opacity: sShift }}>
          <Paper />
          <Svg id="b-shift" boil={2.6}>
            <text x={250} y={330} fontFamily={HAND} fontWeight={700} fontSize={44} fill={INK}>TODAY</text>
            <Shape d="M 480 290 L 1640 290 L 1640 350 L 480 350 Z" />
            <rect x={482} y={292} width={1156 * today} height={56} fill="#4a5a8a" />
            <text x={1060} y={334} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={34} fill="#fbf4e4" opacity={prog(today, 0.5, 0.8)}>
              ONE LONG SLEEP</text>
            <g opacity={easeOut(within(at.strange, 0.8, 1)) + (f >= cue(at.shifts) ? 1 : 0)}>
              <text x={250} y={560} fontFamily={HAND} fontWeight={700} fontSize={44} fill={C.rust}>BEFORE</text>
              <Shape d="M 480 520 L 1640 520 L 1640 580 L 480 580 Z" />
              <rect x={482} y={522} width={1156 * Math.min(sp, 0.46)} height={56} fill="#4a5a8a" />
              {sp > 0.46 && <rect x={482 + 1156 * 0.46} y={522} width={1156 * (Math.min(sp, 0.54) - 0.46)} height={56} fill={C.ochre} />}
              {sp > 0.54 && <rect x={482 + 1156 * 0.54} y={522} width={1156 * (sp - 0.54)} height={56} fill="#4a5a8a" />}
              <line x1={1060} y1={500} x2={1060} y2={600} stroke={C.red} strokeWidth={4} strokeDasharray="8 6" />
              <text x={1060} y={640} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={32} fill={C.red}>MIDNIGHT</text>
              <text x={480} y={640} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#6a5a4a">sunset</text>
              <text x={1640} y={640} textAnchor="middle" fontFamily={HAND} fontSize={30} fill="#6a5a4a">sunrise</text>
              <text x={482 + 1156 * 0.23} y={566} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill="#fbf4e4" opacity={prog(sp, 0.3, 0.42)}>FIRST SLEEP</text>
              <text x={482 + 1156 * 0.77} y={566} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={30} fill="#fbf4e4" opacity={prog(sp, 0.8, 0.95)}>SECOND SLEEP</text>
              <Tag x={1060} y={430} text="~1 HOUR AWAKE" o={prog(sp, 0.47, 0.5)} rot={-3} size={42} color={C.rust} fill="#fff8ea" />
              {f >= cue(at.shifts) && <Moon x={482 + 1156 * sp} y={480} r={22} />}
            </g>
            {f >= cue(at.shifts) && (
              <g>
                <g transform="translate(960 1010) scale(1.35) translate(-960 -1010)">
                <Mound x={960} y={1010} w={460} h={60} seed={13} />
                {awake ? (
                  <Person x={960} y={1010} s={0.8} skin={C.skin1} tunic={C.ochre} hair="bun" pose={{ sit: true, la: 30, lb: -60, ra: 150, rb: 10 }}
                    mood="neutral" look={0} blink={blinkAt(10)} />
                ) : (
                  <g>
                    <g transform="translate(1140 985) rotate(-90)">
                      <Person x={0} y={0} s={0.72} skin={C.skin1} tunic={C.ochre} hair="bun" mood="sleepy" blink pose={{ la: 8, ra: 8 }} />
                    </g>
                    <Zzz x={980} y={900} f={f} />
                  </g>
                )}
                </g>
              </g>
            )}
          </Svg>
        </AbsoluteFill>
      )}

      {/* ================= cliffhanger ================= */}
      {sCliff > 0.001 && (
        <AbsoluteFill style={{ opacity: sCliff, transform: `scale(${push(at.cliff, -1, 0.07)})` }}>
          <Paper />
          <AbsoluteFill style={{ background: '#1d2342', mixBlendMode: 'multiply', opacity: 0.72 }} />
          <Svg id="b-cliff">
            <Stars o={0.7} n={40} maxY={420} seed={31} />
            <Shape d="M 0 820 Q 960 800 1920 824 L 1920 1080 L 0 1080 Z" fill="#5a5638" />
            <Glow x={700} y={900} r={360} o={1} id="emberglow" color="#ff8a3d" />
            <Fire x={700} y={930} s={0.5} t={0.35} />
            <g transform="translate(1000 980) scale(1.25) translate(-1000 -980)">
            <Mound x={1250} y={960} w={460} h={60} seed={17} />
            <g transform="translate(1420 935) rotate(-90)">
              <Person x={0} y={0} s={0.72} skin={C.skin2} tunic={C.rust} hair="beard" mood="sleepy" blink pose={{ la: 8, ra: 8 }} />
            </g>
            <Person x={960} y={980} skin={C.skin1} tunic={C.ochre} hair="bun" pose={{ sit: true, la: 30, lb: -70, ra: 30, rb: -70 }}
              mood="neutral" look={-1} blink={blinkAt(11)} />
            </g>
            <Bubble x={1300} y={360} w={300} h={210} o={easeOut(within(at.cliff, 0.2, 0.4))} from={[1000, 560]}>
              <text x={1300} y={410} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={150} fill={INK}>?</text>
            </Bubble>
          </Svg>
          <div style={{ position: 'absolute', top: 120, left: 0, right: 0, textAlign: 'center', fontFamily: HAND, fontWeight: 700,
            fontSize: 70, color: '#fbf4e4', opacity: easeOut(within(at.cliff, 0.4, 0.6)) }}>WHAT WERE THEY DOING?</div>
        </AbsoluteFill>
      )}
      {tail > 0 && (
        <AbsoluteFill style={{ opacity: tail }}>
          <Paper />
          <div style={{ position: 'absolute', top: 470, left: 0, right: 0, textAlign: 'center', fontFamily: HAND, fontWeight: 700, fontSize: 80, color: INK }}>
            TO BE CONTINUED...</div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};

export default InkPilot;
