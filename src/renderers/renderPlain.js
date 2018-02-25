import _ from 'lodash';

const wrap = v => (_.isString(v) ? `'${v}'` : v);

export default (ast) => {
  const helper = (restAst, prefix = '') => restAst
    .reduce((acc, {
      diffType,
      key,
      content,
      oldContent,
    }) => {
      if (diffType === 'removed') {
        return [...acc, `Property '${prefix}${key}' was removed`];
      }
      if (diffType === 'added' && !_.isArray(content)) {
        return [...acc, `Property '${prefix}${key}' was added with value: ${wrap(content)}`];
      }
      if (diffType === 'added') {
        return [...acc, `Property '${prefix}${key}' was added with complex value`];
      }
      if (diffType === 'updated') {
        const old = _.isArray(oldContent) ? 'complex value' : `${wrap(oldContent)}`;
        const current = _.isArray(content) ? 'complex value' : `${wrap(content)}`;
        return [...acc, `Property '${prefix}${key}' was updated. From ${old} to ${current}`];
      }
      if (_.isArray(content)) {
        return [...acc, ...helper(content, `${prefix}${key}.`)];
      }
      return acc;
    }, []);

  const rows = helper(ast).join('\n');

  return rows;
};
