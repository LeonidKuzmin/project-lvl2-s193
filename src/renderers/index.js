import renderTree from './renderTree';
import renderPlain from './renderPlain';
import renderJSON from './renderJSON';

const renderers = {
  tree: renderTree,
  plain: renderPlain,
  json: renderJSON,
};

export default renderers;
