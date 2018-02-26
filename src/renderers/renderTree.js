import _ from 'lodash';

const spacer = '  ';

const renderValue = (level, value) => {
  if (!_.isObject(value)) {
    return value;
  }
  const rows = Object.keys(value).map(key => `${spacer.repeat(level + 2)}${key}: ${value[key]}`).join('\n');
  return `{\n${rows}\n${spacer.repeat(level)}}`;
};

const templates = {
  inserted: (level, name, value) => `${spacer.repeat(level)}+ ${name}: ${renderValue(level + 1, value)}`,
  deleted: (level, name, value) => `${spacer.repeat(level)}- ${name}: ${renderValue(level + 1, value)}`,
  stable: (level, name, value) => `${spacer.repeat(level)}  ${name}: ${renderValue(level + 1, value)}`,
  changed: (level, name, value) => [
    templates.deleted(level, name, value.old),
    templates.inserted(level, name, value.new),
  ],
  nested: (level, name, value, f) => `${spacer.repeat(level)}  ${name}: ${f(value, level + 2)}`,
};

const renderTree = (ast, level = 1) => {
  const arr = ast
    .map(({ name, type, value }) => templates[type](level, name, value, renderTree));

  const rows = _.flatten(arr).join('\n');

  return `{\n${rows}\n${spacer.repeat(level - 1)}}`;
};

export default renderTree;
