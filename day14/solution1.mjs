#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const platform = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const grid = [];
for (const line of platform.split('\n')) {
  if (!line) continue;
  grid.push(line.split(''));
}
const m = grid.length;
const n = grid[0].length;
let sum = 0;
for (let x = 0; x < n; x++) {
  let slot = 0;
  for (let y = 0; y < m; y++) {
    const c = grid[y][x];
    if (c === 'O') {
      sum += m - slot;
      slot += 1;
    } else if (c === '#') {
      slot = y + 1;
    }
  }
}
console.log(sum);
