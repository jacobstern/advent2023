#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const calibration = await readFile('./input', { encoding: 'utf8' });
const lines = calibration.split('\n');

let sum = 0;

const DIGITS_TABLE = {
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

for (const line of lines) {
  let first = undefined,
    last = undefined;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    let n = parseInt(c);
    if (isNaN(n)) {
      for (const [key, value] of Object.entries(DIGITS_TABLE)) {
        if (line.startsWith(key, i)) {
          n = value;
          break;
        }
      }
    }
    if (!isNaN(n)) {
      if (first === undefined) {
        first = n;
      }
      last = n;
    }
  }
  if (first === undefined) {
    continue;
  }
  sum += first * 10 + last;
}

console.log(sum);
