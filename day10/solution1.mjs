#!/usr/bin/env node

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

let length = 1;
while (tile !== 'S') {
  length++;
  const backDirection = Directions.opposite(priorDirection);
  const direction = PIPES_DIRECTIONS.get(tile).find((d) => d !== backDirection);
  const [newX, newY] = Directions.moveFrom([x, y], direction);
  priorDirection = direction;
  x = newX;
  y = newY;
  tile = lines[y][x];
}

console.log(Math.floor(length / 2));
