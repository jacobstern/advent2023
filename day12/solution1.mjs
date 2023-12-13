#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function solveHelper(
  conditions,
  constraints,
  conditionsIndex,
  constraintsIndex
) {
  if (constraintsIndex === constraints.length) {
    for (let i = conditionsIndex; i < conditions.length; i++) {
      if (conditions[i] === '#') {
        return 0;
      }
    }
    return 1;
  }
  if (conditionsIndex >= conditions.length) {
    return 0;
  }
  let sum = 0;
  const constraint = constraints[constraintsIndex];
  for (let i = conditionsIndex; i <= conditions.length - constraint; i++) {
    let valid = true,
      pos;
    for (pos = i; pos < i + constraint; pos++) {
      if (conditions[pos] === '.') {
        valid = false;
        break;
      }
    }
    if (valid && pos < conditions.length && conditions[pos] === '#') {
      valid = false;
    }
    if (valid) {
      sum += solveHelper(
        conditions,
        constraints,
        pos + 1,
        constraintsIndex + 1
      );
    }
    if (conditions[i] === '#') {
      break;
    }
  }
  return sum;
}

function solve(conditions, constraints) {
  return solveHelper(conditions, constraints, 0, 0);
}

const records = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});

let sum = 0;
for (const line of records.split('\n')) {
  if (!line) continue;
  const [conditionsPart, constraintsPart] = line.split(' ');
  const constraints = constraintsPart.split(',').map((digits) => +digits);
  const nSolutions = solve(conditionsPart, constraints);
  sum += nSolutions;
}
console.log(sum);
