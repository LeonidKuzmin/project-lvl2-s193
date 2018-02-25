import fs from 'fs';
import genDiff, { genDiffWithoutRender } from '../src';

const flatFilesExpectationAST1 = [
  { action: ' ', key: 'host', value: 'hexlet.io' },
  { action: '-', key: 'timeout', value: 50 },
  { action: '+', key: 'timeout', value: 20 },
  { action: '-', key: 'proxy', value: '123.234.53.22' },
  { action: '+', key: 'verbose', value: true },
];

test('Flat files: Compare two JSON files without render', () => {
  expect(genDiffWithoutRender('__tests__/__fixtures__/flat_before.json', '__tests__/__fixtures__/flat_after.json'))
    .toEqual(flatFilesExpectationAST1);
});


const flatFilesExpectation = fs.readFileSync('__tests__/__fixtures__/flat_expectation.txt', 'utf8');

test('Flat files: Compare two JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.json', '__tests__/__fixtures__/flat_after.json'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare two YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.yml', '__tests__/__fixtures__/flat_after.yml'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare JSON and YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.json', '__tests__/__fixtures__/flat_after.yml'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare YAML and JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.yml', '__tests__/__fixtures__/flat_after.json'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare two INI files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.ini', '__tests__/__fixtures__/flat_after.ini'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare JSON and INI files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.json', '__tests__/__fixtures__/flat_after.ini'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare INI and JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.ini', '__tests__/__fixtures__/flat_after.json'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare YAML and INI files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.yml', '__tests__/__fixtures__/flat_after.ini'))
    .toBe(flatFilesExpectation);
});

test('Flat files: Compare INI and YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.ini', '__tests__/__fixtures__/flat_after.yml'))
    .toBe(flatFilesExpectation);
});


const expectationAST1 = [
  {
    action: ' ',
    key: 'common',
    value: [
      { action: ' ', key: 'setting1', value: 'Value 1' },
      { action: '-', key: 'setting2', value: '200' },
      { action: '-', key: 'setting3', value: true },
      {
        action: '+',
        key: 'setting3',
        value: [
          { action: ' ', key: 'key', value: 'value' },
        ],
      },
      {
        action: ' ',
        key: 'setting6',
        value: [
          { action: ' ', key: 'key', value: 'value' },
          { action: '+', key: 'ops', value: 'vops' },
        ],
      },
      { action: '+', key: 'setting4', value: 'blah blah' },
      {
        action: '+',
        key: 'setting5',
        value: [
          { action: ' ', key: 'key5', value: 'value5' },
        ],
      },
    ],
  },

  {
    action: ' ',
    key: 'group1',
    value: [
      { action: '-', key: 'baz', value: 'bas' },
      { action: '+', key: 'baz', value: 'bars' },
      { action: ' ', key: 'foo', value: 'bar' },
      {
        action: '-',
        key: 'nest',
        value: [
          { action: ' ', key: 'key', value: 'value' },
        ],
      },
      { action: '+', key: 'nest', value: 'str' },
    ],
  },

  {
    action: '-',
    key: 'group2',
    value: [
      { action: ' ', key: 'abc', value: '12345' },
    ],
  },

  {
    action: '+',
    key: 'group3',
    value: [
      { action: ' ', key: 'fee', value: '100500' },
    ],
  },
];

test('Compare two JSON files without render', () => {
  expect(genDiffWithoutRender('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json'))
    .toEqual(expectationAST1);
});


const expectation = fs.readFileSync('__tests__/__fixtures__/expectation.txt', 'utf8');

test('Compare two JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json'))
    .toBe(expectation);
});

test('Compare two YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.yml'))
    .toBe(expectation);
});

test('Compare JSON and YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.yml'))
    .toBe(expectation);
});

test('Compare YAML and JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.json'))
    .toBe(expectation);
});

test('Compare two INI files', () => {
  expect(genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.ini'))
    .toBe(expectation);
});

test('Compare JSON and INI files', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.ini'))
    .toBe(expectation);
});

test('Compare INI and JSON files', () => {
  expect(genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.json'))
    .toBe(expectation);
});

test('Compare YAML and INI files', () => {
  expect(genDiff('__tests__/__fixtures__/before.yml', '__tests__/__fixtures__/after.ini'))
    .toBe(expectation);
});

test('Compare INI and YAML files', () => {
  expect(genDiff('__tests__/__fixtures__/before.ini', '__tests__/__fixtures__/after.yml'))
    .toBe(expectation);
});
