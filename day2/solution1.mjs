#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const record = await readFile('./input', { encoding: 'utf8' });
const lines = record.split('\n');

const CUBES_LIMIT = {
  red: 12,
  green: 13,
  blue: 14,
};

let sum = 0;

function test(revealed) {
  const observations = revealed.split('; ');
  for (const observation of observations) {
    const entries = observation.split(', ');
    for (const entry of entries) {
      const [n, color] = entry.split(' ');
      if (n > CUBES_LIMIT[color]) {
        return false;
      }
    }
  }
  return true;
}

for (const line of lines) {
  const [identifier, revealed] = line.split(': ');
  const gameId = parseInt(identifier.substring(5));
  if (test(revealed)) {
    sum += gameId;
  }
}

console.log(sum);
