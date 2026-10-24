// Screenshot a page in light mode: node shot.mjs <page.html> <out.png> <width> <height>
import puppeteer from 'puppeteer-core';
import path from 'node:path';
const [, , src, out, w, h] = process.argv;
const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
const p = await b.newPage();
await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 2 });
await p.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: 'light' }]);
await p.goto('file://' + path.resolve(src));
await p.screenshot({ path: out });
await b.close();
