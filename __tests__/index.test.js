import genDiff from '../src';

test('Compare two JSON files', () => {
  expect(genDiff('../__tests__/__fixtures__/before.json', '../__tests__/__fixtures__/after.json'))
    .toBe(`{
    host: hexlet.io
  + timeout: 20
  - timeout: 50
  - proxy: 123.234.53.22
  + verbose: true
}`);
});
