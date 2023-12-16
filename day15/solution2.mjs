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

const boxes = new Array(256);
for (let i = 0; i < boxes.length; i++) {
  boxes[i] = new Map();
}

const STEP_REGEX = /^(?<label>\w+)(?<operator>[=\-])(?<focalLength>\d*)$/;

for (const step of initializationSequence.trim().split(',')) {
  const match = step.match(STEP_REGEX);
  if (!match) continue;
  const label = match.groups.label;
  const boxIndex = hash(label);
  const box = boxes[boxIndex];
  if (match.groups.operator === '=') {
    const focalLength = +match.groups.focalLength;
    if (box.has(label)) {
      box.get(label).focalLength = focalLength;
    } else {
      box.set(label, { focalLength });
    }
  } else {
    box.delete(label);
  }
}

let sum = 0;
for (const [i, box] of boxes.entries()) {
  let slot = 1;
  for (const { focalLength } of box.values()) {
    sum += (i + 1) * slot * focalLength;
    slot++;
  }
}
console.log(sum);
