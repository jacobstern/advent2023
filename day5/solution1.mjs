#!/usr/bin/env node

import { readFile } from 'node:fs/promises';

const almanac = await readFile('./input.txt', { encoding: 'utf8' });
const lines = almanac.split('\n');

function sortRangesAscending(l, r) {
  return l.srcStart - r.srcStart;
}

const seeds = lines[0];
const seedNumbers = seeds
  .substring(seeds.indexOf(':') + 2)
  .split(' ')
  .map((s) => +s);

const HEADER_REGEX = /^(?<src>\w+)-to-(?<dest>\w+) map:$/;
const RANGE_REGEX = /^(?<dstStart>\d+) (?<srcStart>\d+) (?<length>\d+)$/;
const mappings = new Map();

let row = 1;
while (row < lines.length) {
  const line = lines[row];
  const headerMatch = line.match(HEADER_REGEX);
  row++;
  if (headerMatch == null) {
    continue;
  } else {
    const { src, dest } = headerMatch.groups;
    const ranges = [];
    const mapping = { src, dest, ranges };
    mappings.set(src, mapping);
    while (true) {
      if (row >= lines.length) {
        ranges.sort(sortRangesAscending);
        break;
      }
      const line = lines[row];
      const rangeMatch = line.match(RANGE_REGEX);
      if (rangeMatch == null) {
        ranges.sort(sortRangesAscending);
        break;
      } else {
        row++;
        ranges.push({
          srcStart: +rangeMatch.groups.srcStart,
          dstStart: +rangeMatch.groups.dstStart,
          length: +rangeMatch.groups.length,
        });
      }
    }
  }
}

let minLocation = Infinity;

for (const n of seedNumbers) {
  let srcValue = n;
  let src = 'seed';
  while (src !== 'location') {
    const mapping = mappings.get(src);
    const candidateRange = mapping.ranges.find(
      (range) => range.srcStart + range.length > srcValue
    );
    let dstValue = srcValue;
    if (candidateRange && candidateRange.srcStart <= srcValue) {
      const offset = srcValue - candidateRange.srcStart;
      dstValue = candidateRange.dstStart + offset;
    }
    src = mapping.dest;
    srcValue = dstValue;
  }
  const location = srcValue;
  if (location < minLocation) {
    minLocation = location;
  }
}

console.log(minLocation);
