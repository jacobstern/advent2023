#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function numValidOperations(time, distance) {
  let n = 0;
  for (let holdDuration = 0; holdDuration <= time; holdDuration++) {
    const remaining = time - holdDuration;
    if (remaining * holdDuration > distance) {
      n++;
    }
  }
  return n;
}

const DIGITS_REGEX = /(?<digits>\d+)/g;

const raceTimes = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const [times, distances] = raceTimes.split('\n');
const timesDigits = Array.from(times.matchAll(DIGITS_REGEX));
const distancesDigits = Array.from(distances.matchAll(DIGITS_REGEX));
let output = 1;

for (const [i, match] of timesDigits.entries()) {
  const time = +match.groups.digits;
  const distance = +distancesDigits[i].groups.digits;
  output *= numValidOperations(time, distance);
}

console.log(output);
