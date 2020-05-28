/* eslint-disable  */
const path = require('path')
const webpack = require('webpack')
const StartServerPlugin = require('start-server-webpack-plugin')
const nodeExternals = require('webpack-node-externals')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin')

const { NODE_ENV } = process.env
const isProduction = typeof NODE_ENV !== 'undefined' && NODE_ENV === 'production'
const mode = isProduction ? 'production' : 'development'
const devtool = isProduction ? false : 'inline-source-map'
const dist = path.resolve(__dirname, '..', '..', 'dist')
const plugins = [new webpack.NamedModulesPlugin(), new CleanWebpackPlugin({})]
const entry = isProduction ? ['./src/index.ts'] : ['webpack/hot/poll?1000', './src/index.ts']
const configFile = path.join(__dirname, '..', '..', 'tsconfig.json')

console.log(`Building for : ${mode} environment`)

module.exports = {
	entry,
	watch: !isProduction,
	mode,
	devtool,
	target: 'node',
	stats: 'minimal',
	externals: [nodeExternals({ whitelist: ['webpack/hot/poll?1000'] })],
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader',
				exclude: /node_modules/,
				options: {
					configFile
				}
			},
			{ test: /\.graphql?$/, loader: 'webpack-graphql-loader' }
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
		plugins: [
			new TsconfigPathsPlugin({
				configFile
			})
		]
	},
	plugins: isProduction
		? [...plugins]
		: [
			...plugins,
			new webpack.HotModuleReplacementPlugin(),
			new webpack.NoEmitOnErrorsPlugin(),
			new StartServerPlugin({
				name: 'server.js',
				nodeArgs: ['--inspect']
			})
		],
	node: {
		__dirname: false,
		__filename: false
	},
	output: {
		path: dist,
		filename: 'server.js',
		hotUpdateChunkFilename: '.hot/[id].[hash].hot-update.js',
		hotUpdateMainFilename: '.hot/[hash].hot-update.json'
	},
	watchOptions: {
		ignored: /node_modules/
	}
}
