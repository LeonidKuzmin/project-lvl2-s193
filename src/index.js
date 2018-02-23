import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = [
  {
    check: format => format === '.JSON',
    parser: JSON.parse,
  },
  {
    check: format => format === '.YML',
    parser: yaml.safeLoad,
  },
  {
    check: format => format === '.INI',
    parser: ini.parse,
  },
];

const getParser = format => _.find(parsers, ({ check }) => check(format)).parser;

const parseTextToObj = (text, format) => getParser(format)(text);

const readFileToObj = (pathToFile) => {
  const content = fs.readFileSync(pathToFile, 'utf8');
  const format = path.extname(pathToFile).toUpperCase();
  return parseTextToObj(content, format);
};

const compareObjects = (obj1, obj2) => {
  const resultRows = _.union(Object.keys(obj1), Object.keys(obj2))
    .reduce((acc, key) => {
      if (!obj1[key]) {
        return [...acc, `+ ${key}: ${obj2[key]}`];
      }
      if (!obj2[key]) {
        return [...acc, `- ${key}: ${obj1[key]}`];
      }
      if (obj1[key] === obj2[key]) {
        return [...acc, `  ${key}: ${obj1[key]}`];
      }
      return [...acc, `+ ${key}: ${obj2[key]}`, `- ${key}: ${obj1[key]}`];
    }, [])
    .map(row => `  ${row}`);

  return ['{', ...resultRows, '}'].join('\n');
};

export default (pathToFile1, pathToFile2) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  return compareObjects(obj1, obj2);
};
