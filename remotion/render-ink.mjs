// node render-ink.mjs <CompositionId> <props.json> <out.mp4>
// Renders through @remotion/renderer (the CLI timed out waiting on the font once).
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
import os from 'os';
const [id, propsPath, out] = process.argv.slice(2);
const root = process.cwd();
const inputProps = JSON.parse(fs.readFileSync(propsPath, 'utf8'));
const serveUrl = await bundle({ entryPoint: path.join(root, 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id, inputProps, timeoutInMilliseconds: 120000 });
let last = -10;
await renderMedia({
  serveUrl, composition, inputProps, codec: 'h264', outputLocation: out, crf: 20,
  ...(process.env.FRAMES ? { frameRange: process.env.FRAMES.split('-').map(Number) } : {}),
  timeoutInMilliseconds: 120000,
  concurrency: Math.max(2, os.cpus().length - 1),   // the i3 has 8 threads; default would use 4
  onProgress: ({ progress }) => { const p = Math.floor(progress * 100); if (p >= last + 10) { last = p; console.log(`render ${p}%`); } },
});
console.log('rendered', out);
