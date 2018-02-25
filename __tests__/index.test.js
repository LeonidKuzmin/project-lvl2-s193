import fs from 'fs';
import genDiff from '../src';

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


test('Flat files: Compare two JSON files. Plain output', () => {
  expect(genDiff('__tests__/__fixtures__/flat_before.json', '__tests__/__fixtures__/flat_after.json', 'plain'))
    .toBe(`Property 'timeout' was updated. From 50 to 20
Property 'proxy' was removed
Property 'verbose' was added with value: true
`);
});


const flatFilesExpectationJSON = fs.readFileSync('__tests__/__fixtures__/flat_expectation.json', 'utf8');

test('Flat files: Compare two JSON files. JSON output', () => {
  expect(genDiff(
    '__tests__/__fixtures__/flat_before.json',
    '__tests__/__fixtures__/flat_after.json',
    'json',
  ))
    .toBe(flatFilesExpectationJSON);
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

test('Compare two JSON files. Plain output', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'plain'))
    .toBe(`Property 'common.setting2' was removed
Property 'common.setting3' was updated. From true to complex value
Property 'common.setting6.ops' was added with value: 'vops'
Property 'common.setting4' was added with value: 'blah blah'
Property 'common.setting5' was added with complex value
Property 'group1.baz' was updated. From 'bas' to 'bars'
Property 'group1.nest' was updated. From complex value to 'str'
Property 'group2' was removed
Property 'group3' was added with complex value
`);
});


const expectationJSON = fs.readFileSync('__tests__/__fixtures__/expectation.json', 'utf8');

test('Compare two JSON files. JSON output', () => {
  expect(genDiff('__tests__/__fixtures__/before.json', '__tests__/__fixtures__/after.json', 'json'))
    .toBe(expectationJSON);
});
