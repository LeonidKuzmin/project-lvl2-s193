import _ from 'lodash';

const simpleDiffTypes = new Set(['keeped', 'added', 'removed']);
const simpleDiffTypeRenderers = { keeped: ' ', added: '+', removed: '-' };

export default (ast) => {
  const helper = restAst => restAst
    .reduce((acc, {
      diffType,
      key,
      content,
      oldContent,
    }) => {
      if (simpleDiffTypes.has(diffType) && !_.isArray(content)) {
        return [...acc, `${simpleDiffTypeRenderers[diffType]} ${key}: ${content}`];
      }
      if (simpleDiffTypes.has(diffType)) {
        return [
          ...acc,
          `${simpleDiffTypeRenderers[diffType]} ${key}: {`,
          ...helper(content).map(s => `  ${s}`),
          '  }',
        ];
      }
      if (diffType === 'updated') {
        return [
          ...acc,
          ...(!_.isArray(oldContent)
            ? [`- ${key}: ${oldContent}`]
            : [`- ${key}: {`, ...helper(oldContent).map(s => `  ${s}`), '  }']
          ),
          ...(!_.isArray(content)
            ? [`+ ${key}: ${content}`]
            : [`+ ${key}: {`, ...helper(content).map(s => `  ${s}`), '  }']
          ),
        ];
      }
      return acc;
    }, [])
    .map(s => `  ${s}`);

  const rows = helper(ast).join('\n');

  return `{\n${rows}\n}\n`;
};
