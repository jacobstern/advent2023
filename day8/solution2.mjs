#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const NODE_REGEX = /^(?<start>\w+) = \((?<left>\w+), (?<right>\w+)\)$/;

const network = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const lines = network.split('\n');
const directions = lines[0];
const nodes = new Map();
let currentLocations = [];
for (let i = 2; i < lines.length; i++) {
  const match = lines[i].match(NODE_REGEX);
  if (match) {
    const start = match.groups.start;
    nodes.set(start, {
      L: match.groups.left,
      R: match.groups.right,
    });
    if (start.endsWith('A')) {
      currentLocations.push(start);
    }
  }
}

function gcd(a, b) {
  let t;
  while (b !== 0) {
    t = b;
    b = a % b;
    a = t;
  }
  return a;
}

function lcm(a, b) {
  return (a * b) / gcd(a, b);
}

function lcmMultiple(ns) {
  let acc = ns[0];
  for (let i = 1; i < ns.length; i++) {
    acc = lcm(ns[i], acc);
  }
  return acc;
}

const destinationIters = [];
let iters = 0;
while (currentLocations.length) {
  iters++;
  for (const direction of directions) {
    const nextLocations = [];
    for (const location of currentLocations) {
      nextLocations.push(nodes.get(location)[direction]);
    }
    currentLocations = nextLocations;
  }
  const remainingLocations = [];
  for (const location of currentLocations) {
    if (location.endsWith('Z')) {
      destinationIters.push(iters);
    } else {
      remainingLocations.push(location);
    }
  }
  currentLocations = remainingLocations;
}

console.log(lcmMultiple(destinationIters) * directions.length);
