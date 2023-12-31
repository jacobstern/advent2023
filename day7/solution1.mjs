#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { argv } from 'node:process';

const handsList = await readFile(argv[2] || './input', {
  encoding: 'utf8',
});

const SPECIAL_CARD_VALUES = {
  A: 14,
  K: 13,
  Q: 12,
  J: 11,
  T: 10,
};

function cardValue(card) {
  return SPECIAL_CARD_VALUES[card] || +card;
}

function compareCards(l, r) {
  return cardValue(l) - cardValue(r);
}

const HAND_TYPE_SCORES = {
  fiveOfAKind: 7,
  fourOfAKind: 6,
  fullHouse: 5,
  threeOfAKind: 4,
  twoPair: 3,
  onePair: 2,
  highCard: 1,
};

function getHandType(hand) {
  const frequencies = new Map();
  let maxCount = 0;
  for (const card of hand) {
    const count = frequencies.has(card) ? frequencies.get(card) + 1 : 1;
    maxCount = Math.max(count, maxCount);
    frequencies.set(card, count);
  }
  const numUnique = frequencies.size;
  if (numUnique === 1) {
    return 'fiveOfAKind';
  }
  if (numUnique === 2) {
    if (maxCount === 4) {
      return 'fourOfAKind';
    } else {
      return 'fullHouse';
    }
  }
  if (numUnique === 3) {
    if (maxCount === 3) {
      return 'threeOfAKind';
    } else {
      return 'twoPair';
    }
  }
  if (numUnique === 4) {
    return 'onePair';
  }
  return 'highCard';
}

function compareHandsType(l, r) {
  return HAND_TYPE_SCORES[getHandType(l)] - HAND_TYPE_SCORES[getHandType(r)];
}

function compareHands(l, r) {
  const typeComparison = compareHandsType(l, r);
  if (typeComparison !== 0) {
    return typeComparison;
  }
  for (const [i, cardL] of l.entries()) {
    const cardR = r[i];
    const cardComparison = compareCards(cardL, cardR);
    if (cardComparison !== 0) {
      return cardComparison;
    }
  }
  return 0;
}

function compareHandRecords(l, r) {
  return compareHands(l.hand, r.hand);
}

const handRecords = [];
for (const line of handsList.split('\n')) {
  if (line) {
    const [handString, betDigits] = line.split(' ');
    handRecords.push({
      hand: handString.split(''),
      bet: +betDigits,
    });
  }
}
handRecords.sort(compareHandRecords);

let sum = 0;
for (const [i, { bet }] of handRecords.entries()) {
  const rank = i + 1;
  sum += rank * bet;
}

console.log(sum);
