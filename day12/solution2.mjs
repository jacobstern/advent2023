#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

class Memo2D {
  constructor(aMax, bMax) {
    this.sparseArray = new Array(aMax);
    this.bMax = bMax;
  }

  has(a, b) {
    return (
      Object.hasOwn(this.sparseArray, a) &&
      Object.hasOwn(this.sparseArray[a], b)
    );
  }

  get(a, b) {
    const row = this.sparseArray[a];
    return row && row[b];
  }

  set(a, b, value) {
    if (!Object.hasOwn(this.sparseArray, a)) {
      this.sparseArray[a] = new Array(this.bMax);
    }
    this.sparseArray[a][b] = value;
  }
}

function solveHelper(
  conditions,
  constraints,
  conditionsIndex,
  constraintsIndex,
  precomputedSpace,
  memo
) {
  if (memo.has(conditionsIndex, constraintsIndex)) {
    return memo.get(conditionsIndex, constraintsIndex);
  }
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
  const constraint = constraints[constraintsIndex];
  const requiredSpace = precomputedSpace[constraintsIndex];
  let sum = 0;
  for (
    let i = conditionsIndex;
    i <= conditions.length - constraint - requiredSpace;
    i++
  ) {
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
        constraintsIndex + 1,
        precomputedSpace,
        memo
      );
    }
    if (conditions[i] === '#') {
      break;
    }
  }
  memo.set(conditionsIndex, constraintsIndex, sum);
  return sum;
}

function solve(conditions, constraints) {
  const precomputedSpace = [];
  let requiredSpace = 0;
  for (let i = constraints.length - 1; i >= 0; i--) {
    precomputedSpace.push(requiredSpace);
    requiredSpace += constraints[i] + 1;
  }
  precomputedSpace.reverse();
  return solveHelper(
    conditions,
    constraints,
    0,
    0,
    precomputedSpace,
    new Memo2D(conditions.length, constraints.length)
  );
}

const records = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});

let sum = 0;
for (const line of records.split('\n')) {
  if (!line) continue;
  const [conditionsPart, constraintsPart] = line.split(' ');
  const constraints = constraintsPart.split(',').map((digits) => +digits);
  const nSolutions = solve(
    new Array(5).fill(conditionsPart).join('?'),
    new Array(5).fill(constraints).reduce((l, r) => l.concat(r))
  );
  sum += nSolutions;
}
console.log(sum);
