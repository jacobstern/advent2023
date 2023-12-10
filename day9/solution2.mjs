#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function extrapolate(history) {
  let currentSequence = history;
  const sequenceHead = [];
  while (true) {
    const nextSequence = [];
    let curr = currentSequence[0],
      nZeroes = 0;
    sequenceHead.push(curr);
    for (let i = 1; i < currentSequence.length; i++) {
      const next = currentSequence[i];
      const diff = next - curr;
      if (diff === 0) nZeroes++;
      nextSequence.push(diff);
      curr = next;
    }
    if (nZeroes === nextSequence.length) {
      break;
    }
    currentSequence = nextSequence;
  }
  let placeholder = 0;
  for (let i = sequenceHead.length - 1; i >= 0; i--) {
    const curr = sequenceHead[i];
    placeholder = curr - placeholder;
  }
  return placeholder;
}

const report = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});

let sum = 0;
for (const line of report.split('\n')) {
  if (!line) continue;
  const history = line.split(' ').map((digits) => +digits);
  sum += extrapolate(history);
}
console.log(sum);
