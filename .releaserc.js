const config = {
  ...require("@wrench/semantic-release-ws-preset-nodejs/default"),
};
config.workspace = {
  ...config.workspace,
};
module.exports = config;
