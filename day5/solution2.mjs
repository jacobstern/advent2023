#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const almanac = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});
const lines = almanac.split('\n');

function sortMappingRangesAscending(l, r) {
  return l.srcStart - r.srcStart;
}

function sortRangesAscending(l, r) {
  return l[0] - r[0];
}

function getOverlappingRanges(srcRanges, mappingRanges) {
  const result = [];
  let dstIndex = 0;
  for (const [srcStart, srcEnd] of srcRanges) {
    let srcPointer = srcStart;
    while (
      dstIndex < mappingRanges.length &&
      mappingRanges[dstIndex].srcStart < srcEnd
    ) {
      const dstRange = mappingRanges[dstIndex];
      if (dstRange.srcStart + dstRange.length > srcStart) {
        if (srcPointer < dstRange.srcStart) {
          result.push([srcPointer, dstRange.srcStart]);
        }
        srcPointer = Math.min(dstRange.srcStart + dstRange.length, srcEnd);
        const start = Math.max(srcStart, dstRange.srcStart);
        const end = srcPointer;
        const translationFactor = dstRange.dstStart - dstRange.srcStart;
        result.push([start + translationFactor, end + translationFactor]);
      }
      if (dstRange.srcStart + dstRange.length < srcEnd) {
        dstIndex++;
      } else {
        break;
      }
    }
    if (srcPointer < srcEnd) {
      result.push([srcPointer, srcEnd]);
    }
  }
  result.sort(sortRangesAscending);
  return result;
}

const seeds = lines[0];
const seedNumbers = seeds.substring(seeds.indexOf(':') + 2).split(' ');
const seedRanges = [];
for (let i = 0; i < seedNumbers.length; i += 2) {
  const rangeStart = +seedNumbers[i];
  seedRanges.push([rangeStart, rangeStart + +seedNumbers[i + 1]]);
}
seedRanges.sort(sortRangesAscending);

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
    while (row < lines.length) {
      const line = lines[row];
      const rangeMatch = line.match(RANGE_REGEX);
      if (rangeMatch == null) {
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
    ranges.sort(sortMappingRangesAscending);
  }
}

let srcRanges = seedRanges;
let src = 'seed';
while (src !== 'location') {
  const mapping = mappings.get(src);
  srcRanges = getOverlappingRanges(srcRanges, mapping.ranges);
  src = mapping.dest;
}

console.log(srcRanges[0][0]);
