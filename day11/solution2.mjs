#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

function manhattanDistance([x1, y1], [x2, y2]) {
  return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

const EMPTY_SPACE = '.';
const GALAXY = '#';
const EXPANSION_COEFFICIENT = 1000000;

const image = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const lines = image.split('\n');
const m = lines.length;
const n = lines[0].length;

const sparseEmptyColumns = new Array(n);
for (let i = 0; i < n; i++) {
  if (lines.every((line) => i >= line.length || line[i] === EMPTY_SPACE)) {
    sparseEmptyColumns[i] = 1;
  }
}

const galaxyCoordinates = [];
let yGaps = 0;
for (let y = 0; y < m; y++) {
  let isEmptyRow = true,
    xGaps = 0;
  for (let x = 0; x < n; x++) {
    if (sparseEmptyColumns[x]) {
      xGaps += 1;
    } else if (lines[y][x] === GALAXY) {
      isEmptyRow = false;
      galaxyCoordinates.push([
        [x, y],
        [xGaps, yGaps],
      ]);
    }
  }
  if (isEmptyRow) {
    yGaps += 1;
  }
}

const numGalaxies = galaxyCoordinates.length;
let regularPart = 0,
  expandedPart = 0;
for (let i = 0; i < numGalaxies; i++) {
  for (let j = i + 1; j < numGalaxies; j++) {
    regularPart += manhattanDistance(
      galaxyCoordinates[i][0],
      galaxyCoordinates[j][0]
    );
    expandedPart += manhattanDistance(
      galaxyCoordinates[i][1],
      galaxyCoordinates[j][1]
    );
  }
}

console.log(regularPart + expandedPart * (EXPANSION_COEFFICIENT - 1));
