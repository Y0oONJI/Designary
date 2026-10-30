const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(file) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(code, { exports });
  return exports;
}

const color = load('src/shared/lib/color.ts');
const rem = load('src/features/px-rem/lib/convert.ts');

test('contrast ratio matches WCAG reference values', () => {
  assert.equal(color.contrastRatio('#000000', '#ffffff').toFixed(2), '21.00');
  assert.equal(color.contrastRatio('#ffffff', '#ffffff').toFixed(2), '1.00');
  assert.equal(color.contrastRatio('#767676', '#ffffff').toFixed(2), '4.54');
  assert.equal(color.contrastRatio('#777777', '#ffffff') < 4.5, true);
});

test('hex normalization accepts 3 and 6 digits only', () => {
  assert.equal(color.normalizeHex('#ABC'), '#aabbcc');
  assert.equal(color.normalizeHex('2272EB'), '#2272eb');
  for (const bad of ['', '#12', '#12345', 'zzzzzz', '#1234567']) assert.equal(color.normalizeHex(bad), null, bad);
});

test('suggested foreground reaches the target ratio', () => {
  const hex = color.suggestForeground('#aaaaaa', '#ffffff', 4.5);
  assert.ok(hex);
  assert.ok(color.contrastRatio(hex, '#ffffff') >= 4.5);
  assert.equal(color.suggestForeground('#ffffff', '#ffffff', 22), null);
});

test('px and rem convert with a custom base', () => {
  assert.equal(rem.pxToRem(24, 16), 1.5);
  assert.equal(rem.remToPx(1.5, 10), 15);
  assert.equal(rem.formatNumber(10 / 3), '3.3333');
  assert.equal(rem.parseNumber(''), null);
  assert.equal(rem.parseNumber('abc'), null);
  assert.equal(rem.parseNumber('1e309'), null);
  assert.equal(rem.parseNumber(' 12 '), 12);
});
