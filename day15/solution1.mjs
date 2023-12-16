#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function hash(s) {
  let value = 0;
  for (let i = 0; i < s.length; i++) {
    value += s.charCodeAt(i);
    value *= 17;
    value %= 256;
  }
  return value;
}

const initializationSequence = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
let sum = 0;
for (const step of initializationSequence.trim().split(',')) {
  sum += hash(step);
}
console.log(sum);
