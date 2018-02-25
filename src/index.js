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

const convertToAst = (subTree) => {
  if (!_.isObject(subTree)) {
    return subTree;
  }
  return Object.keys(subTree).reduce((acc, key) =>
    [...acc, { action: ' ', key, value: convertToAst(subTree[key]) }], []);
};

const compareObjects = (obj1, obj2) => _.union(Object.keys(obj1), Object.keys(obj2))
  .reduce((acc, key) => {
    if (!obj1[key]) {
      return [...acc, { action: '+', key, value: convertToAst(obj2[key]) }];
    }
    if (!obj2[key]) {
      return [...acc, { action: '-', key, value: convertToAst(obj1[key]) }];
    }
    if (obj1[key] === obj2[key]) {
      return [...acc, { action: ' ', key, value: convertToAst(obj1[key]) }];
    }
    if (!_.isObject(obj1[key]) || !_.isObject(obj2[key])) {
      return [...acc,
        { action: '-', key, value: convertToAst(obj1[key]) },
        { action: '+', key, value: convertToAst(obj2[key]) },
      ];
    }
    return [...acc, { action: ' ', key, value: compareObjects(obj1[key], obj2[key]) }];
  }, []);
/*
const render = ast => ['{',
  ...ast.map(({ action, key, value }) => {
    if (_.isArray(value)) {
      return `  ${action} ${key}: ${render(value)}`;
    }
    return `  ${action} ${key}: ${value}`;
  }),
  '}',
  '',
].join('\n');
*/
const render = (ast) => {
  const helper = restAst => restAst
    .reduce((acc, { action, key, value }) => {
      if (!_.isArray(value)) {
        return [...acc, `${action} ${key}: ${value}`];
      }
      return [...acc,
        `${action} ${key}: {`,
        ...helper(value).map(s => `  ${s}`),
        '  }'];
    }, [])
    .map(s => `  ${s}`);

  const rows = helper(ast).join('\n');

  return `{\n${rows}\n}\n`;
};

export const genDiffWithoutRender = (pathToFile1, pathToFile2) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  return compareObjects(obj1, obj2);
};

export default (pathToFile1, pathToFile2) => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);
  const ast = compareObjects(obj1, obj2);
  return render(ast);
};
