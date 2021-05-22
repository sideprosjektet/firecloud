// "@nrwl/react/plugins/webpack"
// "@nrwl/react/plugins/webpack"
const getWebpackConfig = require('@nrwl/react/plugins/webpack');
module.exports = (input) => {
  const output = getWebpackConfig(input)
  console.log('changing target from ', output.target, 'to electron-renderer');
  output.target = 'electron-renderer';
  return output;
};
