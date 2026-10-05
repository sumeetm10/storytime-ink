import { bundle } from '@remotion/bundler';
import { selectComposition, renderStill } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
const root = process.cwd();
const job = process.argv[3] || 'pilot_sleep';
const props = JSON.parse(fs.readFileSync(path.join(root, '..', 'output', job, 'props.json'), 'utf8'));
const vo = props.vo; const END = props.durationInSeconds;
const at = (i, k) => { const a = vo[i].start; const b = i + 1 < vo.length ? vo[i + 1].start : END; return a + (b - a) * k; };
const only = (process.argv[2] || '').split(',').filter(Boolean);
const comp = process.argv[4] || 'InkPilot';
const shots = [];
vo.forEach((_, i) => { if (comp === 'InkPilot') { shots.push([`${i}a`, at(i, 0.3)]); shots.push([`${i}b`, at(i, 0.88)]); } else if (i >= (props.intro ? 11 : 0)) shots.push([`${i}`, at(i, 0.6)]); });
shots.push(['end', END - 0.2]);
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: comp, inputProps: props });
const dir = path.join(root, 'out', comp === 'InkPilot' ? 'ink' : job); fs.mkdirSync(dir, { recursive: true });
for (const [k, s] of shots) {
  if (only.length && !only.includes(k)) continue;
  await renderStill({ serveUrl, composition, inputProps: props, output: path.join(dir, `${k}.jpg`), frame: Math.min(Math.round(s * 30), composition.durationInFrames - 1), scale: 0.3, overwrite: true, imageFormat: 'jpeg' });
}
console.log('stills done');
