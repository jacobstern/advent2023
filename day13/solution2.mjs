#!/usr/bin/env node

import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function hasOnePairwiseDifference(l, r) {
  let foundDifferences = 0;
  for (let i = 0; i < l.length; i++) {
    if (l[i] === r[i]) {
      continue;
    } else {
      foundDifferences++;
      if (foundDifferences > 1) {
        break;
      }
    }
  }
  return foundDifferences === 1;
}

function findReflection(lines) {
  for (let i = 1; i < lines.length; i++) {
    let valid = true,
      smudged = false;
    for (let j = 0; j < Math.min(i, lines.length - i); j++) {
      const l = i - j - 1;
      const r = i + j;
      if (lines[l] !== lines[r]) {
        if (!smudged && hasOnePairwiseDifference(lines[l], lines[r])) {
          smudged = true;
        } else {
          valid = false;
          break;
        }
      }
    }
    if (valid && smudged) {
      return i;
    }
  }
  return -1;
}

function analyze(pattern) {
  const horizontal = findReflection(pattern);
  if (horizontal !== -1) {
    return horizontal * 100;
  }
  const columns = [];
  for (let i = 0; i < pattern[0].length; i++) {
    let column = '';
    for (let j = 0; j < pattern.length; j++) {
      column += pattern[j][i];
    }
    columns.push(column);
  }
  const vertical = findReflection(columns);
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
