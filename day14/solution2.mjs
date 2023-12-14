#!/usr/bin/env node

import assert from 'node:assert';
import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const platform = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const grid = [];
for (const line of platform.split('\n')) {
  if (!line) continue;
  grid.push(line.split(''));
}
const n = grid.length;
assert.strictEqual(n, grid[0].length, 'Grid must be square');

const queryRotatedGrid = (d, x, y) => {
  const [xx, yy] = [
    [x, y],
    [y, n - x - 1],
    [n - x - 1, n - y - 1],
    [n - y - 1, x],
  ][d];
  return grid[yy][xx];
};

const blockers = [];
for (let d = 0; d < 4; d++) {
  const direction = [];
  for (let x = 0; x < n; x++) {
    const row = [];
    let last = 0;
    for (let y = 0; y < n; y++) {
      row.push(last);
      if (queryRotatedGrid(d, x, y) === '#') {
        last = y + 1;
      }
    }
    direction.push(row);
  }
  blockers.push(direction);
}

let stones = [];
for (let x = 0; x < n; x++) {
  const column = [];
  for (let y = 0; y < n; y++) {
    const c = grid[y][x];
    if (c === 'O') {
      column.push(y);
    }
  }
  stones.push(column);
}

const seenBoards = [],
  boardsIndex = new Map();
let loopStart, loopEnd;
for (let iter = 0; iter < 1000000000; iter++) {
  const encodedBoard = JSON.stringify(stones);
  if (boardsIndex.has(encodedBoard)) {
    loopStart = boardsIndex.get(encodedBoard);
    loopEnd = iter;
    break;
  }
  boardsIndex.set(encodedBoard, iter);
  seenBoards.push(stones);

  for (let d = 0; d < 4; d++) {
    const nextStones = new Array(n);
    for (let i = 0; i < n; i++) {
      nextStones[i] = [];
    }
    for (const [x, column] of stones.entries()) {
      let slot = 0;
      for (const stone of column) {
        slot = Math.max(slot, blockers[d][x][stone]);
        nextStones[n - slot - 1].push(x);
        slot++;
      }
    }
    stones = nextStones;
  }
}

const loopLength = loopEnd - loopStart;
const finalIter = (1000000000 - loopEnd) % loopLength;
stones = seenBoards[loopStart + finalIter];

let sum = 0;
for (const column of stones) {
  for (const stone of column) {
    sum += n - stone;
  }
}

console.log(sum);
