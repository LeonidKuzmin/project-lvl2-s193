import fs from 'fs';
import path from 'path';
import parsers from './parsers';
import makeDiffAst from './makeDiffAst';
import renderers from './renderers';

const readFileToObj = (pathToFile) => {
  const content = fs.readFileSync(pathToFile, 'utf8');
  const format = path.extname(pathToFile).substr(1).toLowerCase();
  return parsers[format](content);
};

export default (pathToFile1, pathToFile2, outputFormat = 'tree') => {
  const obj1 = readFileToObj(pathToFile1);
  const obj2 = readFileToObj(pathToFile2);

  const ast = makeDiffAst(obj1, obj2);

  return renderers[outputFormat](ast);
};
