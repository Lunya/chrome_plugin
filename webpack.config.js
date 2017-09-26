const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = function(env) {
	var config = './src/config/debug-win.json';
	if (typeof env.config !== 'undefined')
		config = './src/config/' + env.config;

	return {
		entry: {
			background: './src/background.js',
			popup: './src/popup.jsx'
		},
		output: {
			filename: '[name].bundle.js',
			path: path.resolve(__dirname, 'crx')
		},
		module: {
			loaders: [{
				test: /\.jsx?$/,
				include: path.resolve(__dirname,'src'),
				exclude: /node_modules/,
				loader: 'babel-loader',
			}]
		},
		plugins: [
			new CopyPlugin([
				{ from: './src/attachListener.js', to: 'attachListener.js' },
				{ from: './src/manifest.json', to: 'manifest.json' },
				{ from: './src/icon.png', to: 'icon.png' },
				{ from: './src/popup.html', to: 'popup.html' },
				{ from: config, to: 'config.json'}
			]),
		]
	};
};
