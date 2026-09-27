const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file, globals = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports, ...globals });
  return exports;
}

const { snapToFour, quickMultiples } = load('src/features/four-multiple/lib/snapToFour.ts');

test('snap rounding, decimals, ties, and original range limits', () => {
  for (const [input, expected] of [
    ['37', 36], ['38', 40], ['37.9', 36], ['0', 0], ['-20', 0],
    ['696', 696], ['699', 700], ['999', 700], [' 12 ', 12],
    ['', null], [' ', null], ['abc', null], ['Infinity', null], ['1e309', null],
  ]) assert.equal(snapToFour(input), expected, input);
  assert.equal(quickMultiples.length, 174);
  assert.equal(quickMultiples[0], 4);
  assert.equal(quickMultiples.at(-1), 696);
  assert.ok(quickMultiples.every(n => n % 4 === 0));
});

function clipboardEnvironment(legacy, modern) {
  let removed = false;
  let restored = false;
  let appended = false;
  const textarea = {
    style: {}, setAttribute() {}, focus() {}, select() {},
    remove() { removed = true; },
  };
  class HTMLElement {
    focus() { restored = true; }
  }
  const document = {
    activeElement: new HTMLElement(),
    createElement: () => textarea,
    body: { appendChild() { appended = true; } },
    execCommand: legacy,
  };
  const { copyToClipboard } = load('src/shared/lib/clipboard.ts', {
    document, HTMLElement, navigator: modern ? { clipboard: { writeText: modern } } : {},
  });
  return { copyToClipboard, textarea, verifyCleanup() {
    assert.ok(appended && removed && restored);
  } };
}

test('legacy clipboard copies the exact number and restores focus', async () => {
  const env = clipboardEnvironment(() => true);
  await env.copyToClipboard('36');
  assert.equal(env.textarea.value, '36');
  env.verifyCleanup();
});

test('failed legacy copy falls back to clipboard API', async () => {
  let actual;
  const env = clipboardEnvironment(() => false, async text => { actual = text; });
  await env.copyToClipboard('700');
  assert.equal(actual, '700');
  env.verifyCleanup();
});

test('copy failures reject instead of reporting success', async () => {
  for (const legacy of [() => false, () => { throw new Error('blocked'); }]) {
    const env = clipboardEnvironment(legacy, async () => { throw new Error('denied'); });
    await assert.rejects(env.copyToClipboard('4'), /denied/);
    env.verifyCleanup();
  }
  const env = clipboardEnvironment(() => false);
  await assert.rejects(env.copyToClipboard('4'), /Clipboard unavailable/);
  env.verifyCleanup();
});
