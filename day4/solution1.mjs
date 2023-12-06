#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const scratchCard = await readFile('./input', { encoding: 'utf8' });
const lines = scratchCard.split('\n');

let sum = 0;

for (const line of lines) {
  const numbersPart = line.substring(line.indexOf(':') + 1);
  const [winningNumbersPart, myNumbersPart] = numbersPart.split('|');
  const winningNumbers = winningNumbersPart.trim().split(/ +/);
  const myNumbers = myNumbersPart.trim().split(/ +/);
  let result = 0;
  for (const n of myNumbers) {
    if (winningNumbers.includes(n)) {
      if (result === 0) {
        result = 1;
      } else {
        result <<= 1;
      }
    }
  }
  sum += result;
}

console.log(sum);
