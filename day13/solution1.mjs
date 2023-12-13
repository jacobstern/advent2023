#!/usr/bin/env node

import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function encodeLine(line) {
  let res = 0;
  for (const c of line) {
    if (c === '#') {
      res |= 1;
    }
    res <<= 1;
  }
  return res;
}

function findReflection(lines) {
  for (let i = 1; i < lines.length; i++) {
    let valid = true;
    for (let j = 0; j < Math.min(i, lines.length - i); j++) {
      const l = i - j - 1;
      const r = i + j;
      if (lines[l] !== lines[r]) {
        valid = false;
        break;
      }
    }
    if (valid) {
      return i;
    }
  }
  return -1;
}

function analyze(pattern) {
  const encodedRows = pattern.map(encodeLine);
  const horizontal = findReflection(encodedRows);
  if (horizontal !== -1) {
    return horizontal * 100;
  }
  const encodedColumns = [];
  for (let i = 0; i < pattern[0].length; i++) {
    const column = [];
    for (let j = 0; j < pattern.length; j++) {
      column.push(pattern[j][i]);
    }
    encodedColumns.push(encodeLine(column));
  }
  const vertical = findReflection(encodedColumns);
  assert.notStrictEqual(vertical, -1, 'Unable to find reflection');
  return vertical;
}

const notes = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});

let sum = 0;
const pattern = [];

for (const line of notes.split('\n')) {
  if (line.trim()) {
    pattern.push(line);
  } else {
    if (pattern.length) {
      const res = analyze(pattern);
      sum += res;
    }
    pattern.length = 0;
  }
}
if (pattern.length) {
  const res = analyze(pattern);
  sum += res;
}

console.log(sum);
