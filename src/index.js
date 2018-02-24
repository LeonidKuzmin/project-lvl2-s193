import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: ini.parse,
};

const readFileToObj = (pathToFile) => {
  const content = fs.readFileSync(pathToFile, 'utf8');
  const format = path.extname(pathToFile).substr(1).toLowerCase();
  return parsers[format](content);
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
