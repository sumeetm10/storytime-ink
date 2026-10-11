import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, Glow, HAND, INK, Person, Shape } from './kit';
import type { Mood, Pose } from './kit';

// =============================================================================
// Grandpa Flint, the channel's storyteller: an old Stone Age man with a big
// white beard, a fur cloak, a bone necklace and a walking stick. He speaks
// every line - his mouth follows the voice (mouth 0..1 per frame, measured from
// the narration by ink_episode.py) and his face follows the mood of the line.
//   Host       - full figure, for the shots where he tells the story by his fire
//   HostBadge  - the round corner frame he watches every other shot from
// =============================================================================
export const FLINT = { skin: '#9a6744', tunic: '#7a3f2a', hair: 'elder' as const, hairColor: '#eee8dc' };

const Stick: React.FC = () => (
  <g>
    <path d="M 0 -150 L 6 160" stroke={INK} strokeWidth={16} strokeLinecap="round" />
    <path d="M 0 -150 L 6 160" stroke="#8a5a3a" strokeWidth={9} strokeLinecap="round" />
    <path d="M -6 -150 q 6 -22 14 -2" stroke={INK} strokeWidth={5} fill="none" />
  </g>
);

export const Host: React.FC<{ x: number; y: number; s?: number; mood?: Mood; mouth?: number; pose?: Pose; flip?: boolean; look?: number; stick?: boolean }> = ({
  x, y, s = 1, mood = 'happy', mouth = -1, pose = { la: 30, lb: -50, ra: 20, rb: -10 }, flip = false, look = 0, stick = true }) => {
  const f = useCurrentFrame();
  const blink = f % 113 < 4;
  return (
    <Person x={x} y={y} s={s} skin={FLINT.skin} tunic={FLINT.tunic} hair={FLINT.hair} hairColor={FLINT.hairColor} mood={mood}
      pose={pose} blink={blink} look={look} flip={flip} mouth={mouth} necklace hand={stick && !pose.sit ? <Stick /> : undefined} />
  );
};

// the round corner frame: Flint by a little fire, head and shoulders, reacting and talking
export const HostBadge: React.FC<{ mood: Mood; mouth: number; o?: number; x?: number; y?: number; r?: number }> = ({
  mood, mouth, o = 1, x = 1740, y = 870, r = 155 }) => {
  const f = useCurrentFrame();
  const bob = Math.sin(f / 22) * 2;
  return (
    <g opacity={o}>
      <defs><clipPath id="hostClip"><circle cx={x} cy={y} r={r} /></clipPath></defs>
      <circle cx={x + 7} cy={y + 7} r={r} fill="#00000040" />
      <g clipPath="url(#hostClip)">
        <circle cx={x} cy={y} r={r} fill="#2f3560" />
        <Glow x={x - 40} y={y + 120} r={260} o={0.9 + 0.1 * Math.sin(f / 4)} id="hostglow" color="#ffb35c" />
        <Host x={x + 4} y={y + 410 + bob} s={1.35} mood={mood} mouth={mouth} stick={false} look={-1} />
      </g>
      <circle cx={x} cy={y} r={r} fill="none" stroke={INK} strokeWidth={8} />
      <Shape d={`M ${x - 128} ${y + r - 18} L ${x + 128} ${y + r - 18} L ${x + 120} ${y + r + 28} L ${x - 120} ${y + r + 28} Z`} fill="#fbf4e4" sw={5} />
      <text x={x} y={y + r + 17} textAnchor="middle" fontFamily={HAND} fontWeight={700} fontSize={32} fill={C.rust}>GRANDPA FLINT</text>
    </g>
  );
};
