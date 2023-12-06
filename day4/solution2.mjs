#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const scratchCard = await readFile('./input', { encoding: 'utf8' });
const lines = scratchCard.split('\n');
const copies = new Array(lines.length).fill(0);

function markCopies(start, matches, nCopies) {
  for (let i = start + 1; i < start + 1 + matches && i < lines.length; i++) {
    copies[i] += nCopies;
  }
}

let sum = 0;

for (const [i, line] of lines.entries()) {
  const numbersPart = line.substring(line.indexOf(':') + 1);
  const [winningNumbersPart, myNumbersPart] = numbersPart.split('|');
  const winningNumbers = winningNumbersPart.trim().split(/ +/);
  const winningNumbersSet = new Set(winningNumbers);
  const myNumbers = myNumbersPart.trim().split(/ +/);
  let matches = 0;
  for (const n of myNumbers) {
    if (winningNumbersSet.has(n)) {
      matches++;
    }
  }
  const nCopies = copies[i] + 1;
  markCopies(i, matches, nCopies);
  sum += nCopies;
}

console.log(sum);
