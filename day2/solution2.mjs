#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const record = await readFile('./input', { encoding: 'utf8' });
const lines = record.split('\n');

let sum = 0;

function minimum(revealed) {
  const result = {
    red: 0,
    blue: 0,
    green: 0,
  };
  const observations = revealed.split('; ');
  for (const observation of observations) {
    const entries = observation.split(', ');
    for (const entry of entries) {
      const [n, color] = entry.split(' ');
      result[color] = Math.max(result[color], n);
    }
  }
  return result;
}

for (const line of lines) {
  const revealed = line.split(': ')[1];
  const { red, blue, green } = minimum(revealed);
  sum += red * blue * green;
}

console.log(sum);
