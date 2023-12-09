#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function numValidOperations(time, distance) {
  const sqrtTerm = Math.sqrt(time * time - 4 * distance);
  return (
    Math.floor(0.5 * (sqrtTerm + time)) - Math.floor(0.5 * (time - sqrtTerm))
  );
}

function collectDigits(line) {
  return Array.from(line.matchAll(DIGITS_REGEX))
    .map((match) => match.groups.digits)
    .join('');
}

const DIGITS_REGEX = /(?<digits>\d+)/g;

const raceTimes = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const [times, distances] = raceTimes.split('\n');
const timeDigits = collectDigits(times);
const distanceDigits = collectDigits(distances);

console.log(numValidOperations(+timeDigits, +distanceDigits));
