import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import yaml from 'js-yaml';
import ini from 'ini';
import render, { renderPlain, renderJSON } from './renderers';

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


const isPointerToChildren = field => _.isObject(field);

const getChildren = subTree => Object.keys(subTree).reduce((acc, key) => {
  if (!isPointerToChildren(subTree[key])) {
    return [...acc, { diffType: 'inherited', key, value: subTree[key] }];
  }
  return [...acc, { diffType: 'inherited', key, children: getChildren(subTree[key]) }];
}, []);

const compareObjects = (obj1, obj2) => _.union(Object.keys(obj1), Object.keys(obj2))
  .reduce((acc, key) => {
    if (!_.has(obj1, key) && !isPointerToChildren(obj2[key])) {
      return [...acc, { diffType: 'added', key, value: obj2[key] }];
    }
    if (!_.has(obj1, key)) {
      return [...acc, { diffType: 'added', key, children: getChildren(obj2[key]) }];
    }

    if (!_.has(obj2, key) && !isPointerToChildren(obj1[key])) {
      return [...acc, { diffType: 'removed', key, value: obj1[key] }];
    }
    if (!_.has(obj2, key)) {
      return [...acc, { diffType: 'removed', key, children: getChildren(obj1[key]) }];
    }

    if (!isPointerToChildren(obj1[key]) && !isPointerToChildren(obj2[key])
      && obj1[key] === obj2[key]) {
      return [...acc, { diffType: 'keeped', key, value: obj1[key] }];
    }

    if (!isPointerToChildren(obj1[key]) && !isPointerToChildren(obj2[key])
      && obj1[key] !== obj2[key]) {
      return [...acc, {
        diffType: 'updated',
        key,
        oldValue: obj1[key],
        value: obj2[key],
      }];
    }

    if (!isPointerToChildren(obj1[key]) && isPointerToChildren(obj2[key])) {
      return [...acc, {
        diffType: 'updated',
        key,
        oldValue: obj1[key],
        children: getChildren(obj2[key]),
      }];
    }

    if (isPointerToChildren(obj1[key]) && !isPointerToChildren(obj2[key])) {
      return [...acc, {
        diffType: 'updated',
        key,
        oldChildren: getChildren(obj1[key]),
        value: obj2[key],
      }];
    }

    return [...acc, { diffType: 'keeped', key, children: compareObjects(obj1[key], obj2[key]) }];
  }, []);

export default (pathToFile1, pathToFile2, outputFormat) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  const ast = compareObjects(obj1, obj2);

  if (outputFormat && outputFormat === 'plain') {
    return renderPlain(ast);
  }
  if (outputFormat && outputFormat === 'json') {
    return renderJSON(ast);
  }
  return render(ast);
};
