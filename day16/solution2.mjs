#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

class Directions {
  static UPWARD = 0;
  static RIGHT = 1;
  static LEFT = 2;
  static DOWNWARD = 3;

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

const runSplitterTraversal = (start) => {
  const energized = new Array(n * n);
  const visitedSplitters = new Array(n * n);
  const splitters = [start];
  while (splitters.length) {
    const location1D = splitters.pop();
    if (Object.hasOwn(visitedSplitters, location1D)) continue;
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
  return energized;
};

const configurations = [];
for (let i = 0; i < n; i++) {
  configurations.push({ location: [0, i], direction: Directions.RIGHT });
  configurations.push({ location: [i, 0], direction: Directions.DOWNWARD });
  configurations.push({ location: [n - 1, i], direction: Directions.LEFT });
  configurations.push({ location: [i, n - 1], direction: Directions.UPWARD });
}

let max = 0;
for (const { location, direction } of configurations) {
  const { visited, split } = shootBeam(grid, n, location, direction);
  if (split == null) {
    max = Math.max(max, visited.length);
    continue;
  }
  const energized = runSplitterTraversal(split);
  for (const location of visited) {
    energized[location] = 1;
  }
  const energizedCount = Object.keys(energized).length;
  max = Math.max(max, energizedCount);
}

console.log(max);
