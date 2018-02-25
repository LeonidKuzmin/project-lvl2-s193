import _ from 'lodash';

const wrap = v => (_.isString(v) ? `'${v}'` : v);

export default (ast) => {
  const helper = (restAst, prefix = '') => restAst
    .reduce((acc, obj) => {
      if (obj.diffType === 'removed') {
        return [...acc, `Property '${prefix}${obj.key}' was removed`];
      }

      if (obj.diffType === 'added' && _.has(obj, 'value')) {
        return [...acc, `Property '${prefix}${obj.key}' was added with value: ${wrap(obj.value)}`];
      }
      if (obj.diffType === 'added' && _.has(obj, 'children')) {
        return [...acc, `Property '${prefix}${obj.key}' was added with complex value`];
      }

      if (obj.diffType === 'updated') {
        const old = _.has(obj, 'oldChildren') ? 'complex value' : `${wrap(obj.oldValue)}`;
        const current = _.has(obj, 'children') ? 'complex value' : `${wrap(obj.value)}`;
        return [...acc, `Property '${prefix}${obj.key}' was updated. From ${old} to ${current}`];
      }

      if (_.has(obj, 'children')) {
        return [...acc, ...helper(obj.children, `${prefix}${obj.key}.`)];
      }
      return acc;
    }, []);

  const rows = helper(ast).join('\n');

  return `${rows}\n`;
};
