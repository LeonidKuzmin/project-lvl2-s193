import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import render, { renderPlain } from './renderers';

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

const setDiffTypeOfChildren = (subTree) => {
  if (!_.isObject(subTree)) {
    return subTree;
  }
  return Object.keys(subTree).reduce((acc, key) =>
    [...acc, { diffType: 'keeped', key, content: setDiffTypeOfChildren(subTree[key]) }], []);
};

const compareObjects = (obj1, obj2) => _.union(Object.keys(obj1), Object.keys(obj2))
  .reduce((acc, key) => {
    if (!obj1[key]) {
      return [...acc, { diffType: 'added', key, content: setDiffTypeOfChildren(obj2[key]) }];
    }
    if (!obj2[key]) {
      return [...acc, { diffType: 'removed', key, content: setDiffTypeOfChildren(obj1[key]) }];
    }
    if (obj1[key] === obj2[key]) {
      return [...acc, { diffType: 'keeped', key, content: setDiffTypeOfChildren(obj1[key]) }];
    }
    if (!_.isObject(obj1[key]) || !_.isObject(obj2[key])) {
      return [...acc,
        {
          diffType: 'updated',
          key,
          oldContent: setDiffTypeOfChildren(obj1[key]),
          content: setDiffTypeOfChildren(obj2[key]),
        },
      ];
    }
    return [...acc, { diffType: 'keeped', key, content: compareObjects(obj1[key], obj2[key]) }];
  }, []);

/*
export const genDiffWithoutRender = (pathToFile1, pathToFile2) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  return compareObjects(obj1, obj2);
};
*/

export default (pathToFile1, pathToFile2, outputFormat) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  const ast = compareObjects(obj1, obj2);

  if (outputFormat && outputFormat === 'plain') {
    return renderPlain(ast);
  }
  return render(ast);
};
