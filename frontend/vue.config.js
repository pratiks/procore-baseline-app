const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const appName = 'Baseline Procore';

module.exports = {
	lintOnSave: true,
	publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', //in the future to change if diff for non prod.
	outputDir: 'dist',
	assetsDir: 'static',
	devServer: {
		proxy: 'http://localhost:9000'
	},
	configureWebpack: {
		name: appName,
		resolve: {
			alias: {
				'@': resolve('src')
			}
		}
	}
};
/**
 Helpers
 */
function resolve(dir) {
	return path.join(__dirname, dir);
}
