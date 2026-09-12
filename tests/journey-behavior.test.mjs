import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import fs from 'node:fs';

function fixture({ mobile = false, reduced = false, saved = null, hash = '' } = {}) {
  class Element {
    constructor() { this.dataset = {}; this.style = {}; this.attrs = {}; this.listeners = {}; this.textContent = ''; this.open = false; this.classes = new Set(); this.classList = { add: v => this.classes.add(v), contains: v => this.classes.has(v), toggle: (v, yes) => yes ? this.classes.add(v) : this.classes.delete(v) }; }
    addEventListener(type, fn) { this.listeners[type] = fn; }
    setAttribute(k, v) { this.attrs[k] = v; }
    removeAttribute(k) { delete this.attrs[k]; }
    focus() {}
    scrollIntoView() {}
  }
  const shell = new Element(); shell.id = 'page-index--journey-story';
  let measurements = 0;
  const cards = Array.from({ length: 8 }, (_, i) => {
    const e = new Element(); e.id = `page-index--journey-day-${i + 1}`;
    e.dataset = { journeyChapter: String(i), city: String([0, 1, 1, 1, 2, 3, 0, 0][i]), routeEnd: String([0, 1, 1, 2, 3, 4, 4, 4][i]), stamp: 'stamp' };
    if (i === 2 || i === 6) e.classes.add('story-quiet');
    e.getBoundingClientRect = () => { measurements++; return { top: i * 700 }; }; return e;
  });
  const links = cards.map((_, i) => { const e = new Element(); e.dataset.journeyJump = String(i); return e; });
  const elements = Object.fromEntries(['path', 'train', 'motion', 'current-day', 'current-city', 'stamp', 'destination'].map(key => [`[data-journey-${key}]`, new Element()]));
  const path = elements['[data-journey-path]']; path.getTotalLength = () => 875; path.getPointAtLength = x => ({ x, y: 0 });
  const root = new Element(); root.closest = () => shell; root.getClientRects = () => shell.open ? [1] : [];
  root.getBoundingClientRect = () => ({ top: 0, bottom: 6000 });
  root.querySelector = selector => elements[selector];
  root.querySelectorAll = selector => selector === '[data-journey-chapter]' ? cards : selector === '[data-journey-jump]' ? links : [];
  const media = { matches: mobile, addEventListener() {} };
  const preference = { matches: reduced, addEventListener() {} };
  const events = {}; const frames = new Map(); let id = 0;
  const document = { hidden: false, querySelector: () => root, querySelectorAll: () => [], addEventListener: (name, fn) => { events[name] = fn; } };
  const location = { hash };
  vm.runInNewContext(fs.readFileSync('src/scripts/journey.js', 'utf8'), {
    document, location, matchMedia: q => q.includes('prefers-reduced') ? preference : media,
    sessionStorage: { getItem: () => saved, setItem: (_, v) => { saved = v; } },
    innerWidth: mobile ? 390 : 1280, innerHeight: 800,
    requestAnimationFrame: fn => { frames.set(++id, fn); return id; }, cancelAnimationFrame: n => frames.delete(n),
    performance: { now: () => 0 }, addEventListener: (name, fn) => { events[name] = fn; },
    history: { replaceState: (_, __, value) => { location.hash = value; } },
  });
  return { shell, root, cards, links, elements, frames, events, document, location, measurements: () => measurements, flush() { const work = [...frames.values()]; frames.clear(); work.forEach(fn => fn(1000)); }, clickDay(i) { links[i].listeners.click({ button: 0, preventDefault() {} }); } };
}

test('mobile defaults to reduced motion while respecting explicit preference and system setting', () => {
  const mobile = fixture({ mobile: true });
  assert.equal(mobile.elements['[data-journey-motion]'].textContent, '啟用動畫');
  assert.equal(mobile.root.classList.contains('motion-paused'), true);
  const opted = fixture({ mobile: true, saved: 'false' });
  assert.equal(opted.root.classList.contains('motion-paused'), false);
  const system = fixture({ reduced: true, saved: 'false' });
  assert.equal(system.elements['[data-journey-motion]'].disabled, true);
  assert.equal(system.root.classList.contains('motion-paused'), true);
});

test('closed, offscreen and background story avoids chapter measurements', () => {
  const f = fixture(); f.events.scroll(); f.flush(); assert.equal(f.measurements(), 0);
  f.shell.open = true; f.root.getBoundingClientRect = () => ({ top: 1000, bottom: 7000 });
  f.events.scroll(); f.flush(); assert.equal(f.measurements(), 0);
  f.document.hidden = true; f.events.scroll(); f.flush(); assert.equal(f.measurements(), 0);
});

test('standalone deep links open disclosure; date jumps keep prefixed ids and distinguish destination', () => {
  const f = fixture({ hash: '#page-index--journey-day-5' });
  assert.equal(f.shell.open, true);
  f.clickDay(4);
  assert.equal(f.location.hash, '#page-index--journey-day-5');
  assert.equal(f.elements['[data-journey-current-city]'].textContent, '弗羅茨瓦夫 Wrocław');
  assert.equal(f.elements['[data-journey-destination]'].textContent, '本日終點：波茲南 Poznań');
  assert.equal(f.links[4].attrs['aria-current'], 'step');
  f.clickDay(2); assert.equal(f.frames.size, 0, 'historical chapter snaps without animation');
});

test('home keeps essential index before optional story and day pages do not load animation', () => {
  const home = fs.readFileSync('dist/index.html', 'utf8');
  assert.ok(home.indexOf('id="days"') < home.indexOf('data-journey-shell'));
  assert.match(home, /<details class="journey-shell" id="journey-story" data-journey-shell>/);
  assert.doesNotMatch(fs.readFileSync('dist/day-05.html', 'utf8'), /assets\/journey.js/);
});
