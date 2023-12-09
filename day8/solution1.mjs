#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const NODE_REGEX = /^(?<start>[A-Z]+) = \((?<left>[A-Z]+), (?<right>[A-Z]+)\)$/;

const network = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const lines = network.split('\n');
const directions = lines[0];
const nodes = new Map();
for (let i = 2; i < lines.length; i++) {
  const match = lines[i].match(NODE_REGEX);
  if (match) {
    nodes.set(match.groups.start, {
      L: match.groups.left,
      R: match.groups.right,
    });
  }
}
let steps = 0;
let location = 'AAA';
while (location !== 'ZZZ') {
  for (const direction of directions) {
    location = nodes.get(location)[direction];
    steps++;
  }
}

console.log(steps);
