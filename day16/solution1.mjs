#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

class Directions {
  static UPWARD = 0;
  static RIGHT = 1;
  static LEFT = 2;
  static DOWNWARD = 3;

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

function encode1D(location, n) {
  const [x, y] = location;
  return x + y * n;
}

const SPLITTERS = {
  '|': [Directions.UPWARD, Directions.DOWNWARD],
  '-': [Directions.LEFT, Directions.RIGHT],
};

function shootBeam(grid, n, location, direction) {
  const visited = [];
  while (true) {
    const [x, y] = location;
    const location1D = encode1D(location, n);
    if (x < 0 || y < 0 || x >= n || y >= n) {
      return { visited, split: null };
    }
    const c = grid[y][x];
    if (c === '\\') {
      direction ^= 2;
    } else if (c === '/') {
      direction ^= 1;
    } else if (SPLITTERS[c] && !SPLITTERS[c].includes(direction)) {
      return { visited, split: location1D };
    }
    // Don't add splitter location to visited list
    visited.push(location1D);
    location = Directions.moveFrom(location, direction);
  }
}

const map = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const grid = map
  .split('\n')
  .filter((line) => !!line)
  .map((line) => line.split(''));
const n = grid.length;
const splitterBeams = new Array(n * n);
for (let y = 0; y < n; y++) {
  for (let x = 0; x < n; x++) {
    const c = grid[y][x];
    if (Object.hasOwn(SPLITTERS, c)) {
      const location = [x, y];
      splitterBeams[encode1D(location, n)] = SPLITTERS[c].map((direction) => {
        return shootBeam(grid, n, location, direction);
      });
    }
  }
}
const { visited, split } = shootBeam(grid, n, [0, 0], Directions.RIGHT);
const energized = new Array(n * n);
for (const location1D of visited) {
  energized[location1D] = 1;
}
const visitedSplitters = new Array(n * n);
const splitters = [];
if (split != null) {
  splitters.push(split);
}
while (splitters.length) {
  const location1D = splitters.pop();
  if (Object.hasOwn(visitedSplitters, location1D)) {
    continue;
  }
  visitedSplitters[location1D] = 1;
  const destinations = splitterBeams[location1D];
  for (const { visited, split } of destinations) {
    for (const location1D of visited) {
      energized[location1D] = 1;
    }
    if (split != null) {
      splitters.push(split);
    }
  }
}

console.log(Object.keys(energized).length);
