#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const schematic = await readFile('./input', { encoding: 'utf8' });
const lines = schematic.split('\n');
const m = lines.length;
const n = lines[0].length;

const gearsSparseMatrix = new Array(m);

function markGear(x, y, i) {
  if (x < 0 || y < 0 || x >= n || y >= m) {
    return;
  }
  if (lines[y][x] === '*') {
    if (y in gearsSparseMatrix && x in gearsSparseMatrix[y]) {
      const gear = gearsSparseMatrix[y][x];
      if (gear.n < 2) {
        gear.ratio *= i;
      }
      gear.n++;
    } else {
      gearsSparseMatrix[y] ||= new Array(n);
      gearsSparseMatrix[y][x] = { n: 1, ratio: i };
    }
  }
}

const DIGITS_REGEX = /(?<digits>\d+)/g;

for (let j = 0; j < m; j++) {
  const line = lines[j];
  for (const match of line.matchAll(DIGITS_REGEX)) {
    const i = match.index;
    const s = match.groups.digits;
    const l = s.length;
    const n = +s;
    markGear(i - 1, j, n);
    markGear(i + l, j, n);
    for (let x = i - 1; x < i + l + 1; x++) {
      markGear(x, j - 1, n);
      markGear(x, j + 1, n);
    }
  }
}

let sum = 0;
for (const j in gearsSparseMatrix) {
  const row = gearsSparseMatrix[j];
  for (const i in row) {
    const { n, ratio } = row[i];
    if (n === 2) {
      sum += ratio;
    }
  }
}

console.log(sum);
