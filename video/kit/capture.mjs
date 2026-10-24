// Usage: node capture.mjs <page.html> <out.mp4> [--stills t1,t2,...]
// Renders the page's window.render(t) frame by frame at 30 fps and pipes frames to ffmpeg.
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import path from 'node:path';

const [, , pageArg, outArg, ...rest] = process.argv;
const stills = rest[0] === '--stills' ? rest[1].split(',').map(Number) : null;
const FPS = 30;
const browser = await puppeteer.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: 'new',
  args: ['--hide-scrollbars', '--autoplay-policy=no-user-gesture-required', '--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
await page.goto('file://' + path.resolve(pageArg), { waitUntil: 'networkidle0' });
await page.evaluate(async () => {
  window.CAPTURE = true;
  await document.fonts.ready;
  const v = null;
  await window.VIDS_READY;
});

if (stills) {
  for (const t of stills) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: `${outArg}-${String(t).replace('.', '_')}.png` });
  }
} else {
  const dur = await page.evaluate(() => window.DUR);
  const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '18', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', outArg], { stdio: ['pipe', 'inherit', 'inherit'] });
  const n = Math.round(dur * FPS);
  for (let i = 0; i < n; i++) {
    await page.evaluate(t => window.render(t), i / FPS);
    const buf = await page.screenshot({ type: 'jpeg', quality: 92 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 300 === 0) console.log(`frame ${i}/${n}`);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  console.log(outArg);
}
await browser.close();
