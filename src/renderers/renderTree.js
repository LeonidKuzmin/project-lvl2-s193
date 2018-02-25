import _ from 'lodash';

const simpleDiffTypes = new Set(['keeped', 'added', 'removed', 'inherited']);

const simpleDiffTypeRenderers = {
  keeped: ' ',
  added: '+',
  removed: '-',
  inherited: ' ',
};

export default (ast) => {
  const helper = restAst => restAst
    .reduce((acc, obj) => {
      if (simpleDiffTypes.has(obj.diffType) && _.has(obj, 'value')) {
        return [...acc, `${simpleDiffTypeRenderers[obj.diffType]} ${obj.key}: ${obj.value}`];
      }
      if (simpleDiffTypes.has(obj.diffType) && _.has(obj, 'children')) {
        return [
          ...acc,
          `${simpleDiffTypeRenderers[obj.diffType]} ${obj.key}: {`,
          ...helper(obj.children).map(s => `  ${s}`),
          '  }',
        ];
      }

      if (obj.diffType === 'updated') {
        return [
          ...acc,
          ...(_.has(obj, 'oldValue')
            ? [`- ${obj.key}: ${obj.oldValue}`] : []),
          ...(_.has(obj, 'oldChildren')
            ? [`- ${obj.key}: {`, ...helper(obj.oldChildren).map(s => `  ${s}`), '  }'] : []),
          ...(_.has(obj, 'value')
            ? [`+ ${obj.key}: ${obj.value}`] : []),
          ...(_.has(obj, 'children')
            ? [`+ ${obj.key}: {`, ...helper(obj.children).map(s => `  ${s}`), '  }'] : []),
        ];
      }
      return acc;
    }, [])
    .map(s => `  ${s}`);

  const rows = helper(ast).join('\n');

  return `{\n${rows}\n}\n`;
};
