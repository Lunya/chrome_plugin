const merge = require('webpack-merge');
const baseConfig = require('./base.config.js');
const webpack = require('webpack');

module.exports = merge(baseConfig, {

	plugins: [
		new webpack.DefinePlugin({
			BASE_URL : JSON.stringify('http://37.59.110.250')
		}),
		new webpack.optimize.UglifyJsPlugin()
	]
});