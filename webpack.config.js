var webpack = require('webpack');
var pathToDist = "./dist";
require("babel-polyfill");

const NODE_ENV = process.env.NODE_ENV || 'development';

module.exports = {
	entry: ['babel-polyfill', './src/script.js'],
	output: {
		path: /*__dirname + */pathToDist,
		filename: 'bundle.js'
	},

	resolve: {
		modulesDirectories: ['node_modules'],
		extensions: ['', '.js']
	},

	resolveLoader: {
		modulesDirectories: ['node_modules'],
		moduleTemplates: ['*-loader', '*'],
		extensions: ['', '.js']
	},

	module: {
		loaders: [
			{loader: 'babel-loader' }
		]
	},
	plugins: [

	],

	watch: NODE_ENV == 'development',

	watchOptions:{
		aggregateTimeout: 100
	},

	devtool: NODE_ENV == 'development' ? "cheap-inline-module-source-map" : null


};

if(NODE_ENV == 'production'){
	module.exports.plugins.push(
		new webpack.optimize.UglifyJsPlugin({
			minimize: true,
			warnings: false,
			drop_console: true,
			unsafe: true
		})
	)
}