#!/usr/bin/env node

import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

class Directions {
  static NORTH = 0;
  static EAST = 1;
  static WEST = 2;
  static SOUTH = 3;

  static ALL = [
    Directions.NORTH,
    Directions.EAST,
    Directions.WEST,
    Directions.SOUTH,
  ];

  static opposite(direction) {
    return ~direction & 3;
  }

  static moveFrom(location, direction) {
    const [x, y] = location;
    const xOffset = [0, 1, -1, 0][direction];
    const yOffset = [-1, 0, 0, 1][direction];
    return [x + xOffset, y + yOffset];
  }
}

const PIPES_DIRECTIONS = new Map([
  ['|', [Directions.NORTH, Directions.SOUTH]],
  ['-', [Directions.EAST, Directions.WEST]],
  ['L', [Directions.NORTH, Directions.EAST]],
  ['J', [Directions.NORTH, Directions.WEST]],
  ['7', [Directions.SOUTH, Directions.WEST]],
  ['F', [Directions.SOUTH, Directions.EAST]],
]);

const tiles = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const lines = tiles.split('\n');
const m = lines.length;
const n = lines[0].length;

let x, y;
for (const [j, line] of lines.entries()) {
  let done = false;
  for (let i = 0; i < line.length; i++) {
    if (line[i] === 'S') {
      x = i;
      y = j;
      done = true;
      break;
    }
  }
  if (done) {
    break;
  }
}

let priorDirection, tile;
for (const direction of Directions.ALL) {
  const [candX, candY] = Directions.moveFrom([x, y], direction);
  if (candX >= 0 && candX < n && candY >= 0 && candY < m) {
    const candidate = lines[candY][candX];
    if (
      PIPES_DIRECTIONS.has(candidate) &&
      PIPES_DIRECTIONS.get(candidate).includes(Directions.opposite(direction))
    ) {
      x = candX;
      y = candY;
      priorDirection = direction;
      tile = candidate;
      break;
    }
  }
}

const startDirection = priorDirection;

const loopTiles = new Array(m);
for (let j = 0; j < m; j++) {
  loopTiles[j] = new Array(n);
}

while (tile !== 'S') {
  loopTiles[y][x] = tile;
  const backDirection = Directions.opposite(priorDirection);
  const direction = PIPES_DIRECTIONS.get(tile).find((d) => d !== backDirection);
  const [newX, newY] = Directions.moveFrom([x, y], direction);
  priorDirection = direction;
  x = newX;
  y = newY;
  tile = lines[y][x];
}

let startTile;
for (const [tile, directions] of PIPES_DIRECTIONS.entries()) {
  if (
    directions.includes(startDirection) &&
    directions.includes(Directions.opposite(priorDirection))
  ) {
    startTile = tile;
    break;
  }
}
assert(startTile, 'Failed to compute start tile');
loopTiles[y][x] = startTile;

let total = 0;
for (let j = 0; j < m; j++) {
  let nIntersections = 0,
    corner;
  for (let i = 0; i < n; i++) {
    if (Object.hasOwn(loopTiles, j) && Object.hasOwn(loopTiles[j], i)) {
      const tile = loopTiles[j][i];
      if (tile === '-') {
        continue;
      }
      if (tile === '|') {
        nIntersections++;
      } else if (corner) {
        const allDirections = [
          ...PIPES_DIRECTIONS.get(tile),
          ...PIPES_DIRECTIONS.get(corner),
        ];
        if (
          allDirections.includes(Directions.SOUTH) &&
          allDirections.includes(Directions.NORTH)
        ) {
          nIntersections++;
        }
        corner = undefined;
      } else {
        corner = tile;
      }
    } else if (nIntersections % 2 !== 0) {
      total++;
    }
  }
}

console.log(total);
