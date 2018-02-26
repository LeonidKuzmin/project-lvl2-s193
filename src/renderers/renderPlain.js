import _ from 'lodash';

const renderValue = (value) => {
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return 'complex value';
  }
  return value;
};

const templates = {
  inserted: (prefix, name, value) => `Property '${prefix}${name}' was added with ${_.isObject(value) ? '' : 'value: '}${renderValue(value)}`,
  deleted: (prefix, name) => `Property '${prefix}${name}' was removed`,
  changed: (prefix, name, value) => `Property '${prefix}${name}' was updated. From ${renderValue(value.old)} to ${renderValue(value.new)}`,
  nested: (prefix, name, value, f) => `${f(value, `${prefix}${name}.`)}`,
};

const renderPlain = (ast, prefix = '') => {
  const arr = ast
    .filter(({ type }) => _.has(templates, type))
    .map(({ name, type, value }) => templates[type](prefix, name, value, renderPlain));

  const rows = _.flatten(arr).join('\n');

  return rows;
};

export default renderPlain;
