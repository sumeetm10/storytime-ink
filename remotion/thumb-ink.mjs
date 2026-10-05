// node thumb-ink.mjs <out.jpg> [top] [bottom]   -> 1280x720 thumbnail
import { bundle } from '@remotion/bundler';
import { renderStill, selectComposition } from '@remotion/renderer';
import path from 'path';
import fs from 'fs';
const [out, a, b] = process.argv.slice(2);
// either: <out> TOP BOTTOM   or: <out> --props props.json  ({top, bottom, svg})
const inputProps = a === '--props' ? JSON.parse(fs.readFileSync(b, 'utf8')) : { ...(a ? { top: a } : {}), ...(b ? { bottom: b } : {}) };
const serveUrl = await bundle({ entryPoint: path.join(process.cwd(), 'src', 'index.ts') });
const composition = await selectComposition({ serveUrl, id: 'InkThumb', inputProps });
await renderStill({ serveUrl, composition, inputProps, output: out, frame: 0, scale: 2 / 3, imageFormat: 'jpeg', jpegQuality: 92, overwrite: true });
console.log('thumb', out);
