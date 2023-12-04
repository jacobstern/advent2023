#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const schematic = await readFile('./input', { encoding: 'utf8' });
const lines = schematic.split('\n');
const m = lines.length;
const n = lines[0].length;

function isSymbol(c) {
  return isNaN(Number(c)) && c !== '.';
}

function querySymbol(x, y) {
  if (x < 0 || y < 0 || x >= n || y >= m) {
    return false;
  }
  const c = lines[y][x];
  return isSymbol(c);
}

let sum = 0;

for (let j = 0; j < m; j++) {
  const line = lines[j];
  let i = 0;
  while (i < n) {
    const c = line[i];
    if (!isNaN(Number(c))) {
      const n = parseInt(line.substring(i), 10);
      const l = String(n).length;
      let isAdjacent = false;
      if (querySymbol(i - 1, j) || querySymbol(i + l, j)) {
        isAdjacent = true;
      } else {
        for (let x = i - 1; x < i + l + 1; x++) {
          if (querySymbol(x, j - 1) || querySymbol(x, j + 1)) {
            isAdjacent = true;
            break;
          }
        }
      }
      if (isAdjacent) {
        sum += n;
      }
      i += l;
    } else {
      i++;
    }
  }
}

console.log(sum);
