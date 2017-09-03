const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');


module.exports = {
	entry: {
		background: './src/eventPage.js',
		popup: './src/popup.js'
	},
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'crx')
	},
	plugins: [
		new CopyPlugin([
			{ from: './src/attachListener.js', to: 'attachListener.js' },
			{ from: './src/manifest.json', to: 'manifest.json' },
			{ from: './src/icon.png', to: 'icon.png' },
			{ from: './src/popup.html', to: 'popup.html' }
		]),
	]
};