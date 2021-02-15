// process.env pass by webpack

export default {
  domain: process.env.DOMAIN,
  contextRoot: process.env.CONTEXT_ROOT,
  nodeEnv: process.env.NODE_ENV,
};
