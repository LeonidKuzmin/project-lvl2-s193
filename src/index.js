import fs from 'fs';
import _ from 'lodash';

const readJsonFile = (pathToFile) => {
  try {
    return JSON.parse(fs.readFileSync(pathToFile, 'utf8'));
  } catch (err) {
    console.error(`Error: can not read ${pathToFile} file!`);
    return {};
  }
};

export default (pathToFile1, pathToFile2) => {
  const obj1 = readJsonFile(pathToFile1);
  const obj2 = readJsonFile(pathToFile2);

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
